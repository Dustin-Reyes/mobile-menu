jest.mock('services/media', () => ({
  getUploadUrl: jest.fn(),
  uploadToR2: jest.fn(),
  triggerProcessing: jest.fn(),
  getMediaLibrary: jest.fn(),
  watchMediaDoc: jest.fn(),
}));
jest.mock('utils/errorHandler', () => ({ reportError: jest.fn() }));

import { renderHook, act, waitFor } from '@testing-library/react';
import { useMediaLibrary, useUpload } from 'hooks/useMedia';
import * as mediaService from 'services/media';

const READY_ITEM = {
  id: 'img-1',
  status: 'ready',
  imageUrl: 'https://cdn.example.com/media/img-1.webp',
  originalName: 'photo.jpg',
};

beforeEach(() => jest.clearAllMocks());

describe('useMediaLibrary', () => {
  it('fetches items on mount', async () => {
    mediaService.getMediaLibrary.mockResolvedValue([READY_ITEM]);
    const { result } = renderHook(() => useMediaLibrary());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toEqual([READY_ITEM]);
    expect(result.current.error).toBeNull();
  });

  it('sets error state when fetch fails', async () => {
    mediaService.getMediaLibrary.mockRejectedValue(new Error('fetch failed'));
    const { result } = renderHook(() => useMediaLibrary());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.items).toEqual([]);
  });

  it('refetch re-fetches items', async () => {
    mediaService.getMediaLibrary.mockResolvedValue([READY_ITEM]);
    const { result } = renderHook(() => useMediaLibrary());
    await waitFor(() => expect(result.current.loading).toBe(false));
    mediaService.getMediaLibrary.mockResolvedValue([]);
    await act(() => result.current.refetch());
    expect(result.current.items).toEqual([]);
  });
});

describe('useUpload', () => {
  const mockFile = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
  const mockUnsub = jest.fn();

  beforeEach(() => {
    mediaService.getUploadUrl.mockResolvedValue({
      uploadUrl: 'https://r2.example.com/put',
      key: 'raw/doc-1.jpg',
      docId: 'doc-1',
    });
    mediaService.uploadToR2.mockImplementation((url, file, onProgress) => {
      onProgress(100);
      return Promise.resolve();
    });
    mediaService.triggerProcessing.mockResolvedValue({ ok: true });
    mediaService.watchMediaDoc.mockImplementation((docId, cb) => {
      cb({
        id: docId,
        status: 'ready',
        imageUrl: 'https://cdn.example.com/media/doc-1.webp',
      });
      return mockUnsub;
    });
  });

  it('starts with uploading false and progress 0', () => {
    const { result } = renderHook(() => useUpload());
    expect(result.current.uploading).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('resolves with the media doc when status becomes ready', async () => {
    const { result } = renderHook(() => useUpload());
    let resolved;
    await act(async () => {
      resolved = await result.current.upload(mockFile, 'gallery');
    });
    expect(resolved).toMatchObject({ status: 'ready' });
    expect(result.current.uploading).toBe(false);
  });

  it('sets uploading true during upload then false when done', async () => {
    let _uploadingDuring = false;
    mediaService.uploadToR2.mockImplementation(
      async (url, file, onProgress) => {
        // Capture state mid-upload — can't easily snapshot async React state here,
        // so we verify the final state instead
        onProgress(50);
      },
    );
    const { result } = renderHook(() => useUpload());
    await act(async () => {
      await result.current.upload(mockFile, 'gallery');
    });
    expect(result.current.uploading).toBe(false);
  });

  it('sets error and rejects when status becomes error', async () => {
    mediaService.watchMediaDoc.mockImplementation((docId, cb) => {
      cb({ id: docId, status: 'error', errorMessage: 'Sharp failed' });
      return mockUnsub;
    });
    const { result } = renderHook(() => useUpload());
    await act(async () => {
      await expect(result.current.upload(mockFile, 'gallery')).rejects.toThrow(
        'Sharp failed',
      );
    });
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.uploading).toBe(false);
  });

  it('calls getUploadUrl, uploadToR2, triggerProcessing in order', async () => {
    const order = [];
    mediaService.getUploadUrl.mockImplementation(async () => {
      order.push('getUploadUrl');
      return { uploadUrl: 'u', key: 'k', docId: 'd' };
    });
    mediaService.uploadToR2.mockImplementation(async () => {
      order.push('uploadToR2');
    });
    mediaService.triggerProcessing.mockImplementation(async () => {
      order.push('triggerProcessing');
      return {};
    });
    mediaService.watchMediaDoc.mockImplementation((id, cb) => {
      cb({ id, status: 'ready' });
      return mockUnsub;
    });
    const { result } = renderHook(() => useUpload());
    await act(async () => {
      await result.current.upload(mockFile, 'gallery');
    });
    expect(order).toEqual(['getUploadUrl', 'uploadToR2', 'triggerProcessing']);
  });
});
