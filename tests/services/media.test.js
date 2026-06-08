jest.mock('config/firebase', () => ({
  auth: { currentUser: null },
  db: {},
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  deleteDoc: jest.fn().mockResolvedValue({}),
  doc: jest.fn(),
}));
jest.mock('utils/errorHandler', () => ({
  reportError: jest.fn(),
}));

import { auth } from 'config/firebase';
import { getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';
import {
  getUploadUrl,
  uploadToR2 as _uploadToR2,
  triggerProcessing,
  deleteMedia,
  getMediaLibrary,
  watchMediaDoc,
} from 'services/media';

const mockUser = { getIdToken: jest.fn().mockResolvedValue('test-token') };

function mockFetchResponse(body, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 400,
    json: async () => body,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  auth.currentUser = mockUser;
});

describe('getUploadUrl', () => {
  it('POSTs to get-upload-url and returns response', async () => {
    mockFetchResponse({
      uploadUrl: 'https://r2.example.com/put',
      key: 'raw/id.jpg',
      docId: 'id-1',
    });
    const result = await getUploadUrl('photo.jpg', 'gallery', 'image/jpeg');
    expect(result).toEqual({
      uploadUrl: 'https://r2.example.com/put',
      key: 'raw/id.jpg',
      docId: 'id-1',
    });
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/.netlify/functions/get-upload-url');
    expect(options.headers['Authorization']).toBe('Bearer test-token');
    expect(JSON.parse(options.body)).toEqual({
      filename: 'photo.jpg',
      preset: 'gallery',
      mimeType: 'image/jpeg',
    });
  });

  it('throws when not authenticated', async () => {
    auth.currentUser = null;
    await expect(
      getUploadUrl('photo.jpg', 'gallery', 'image/jpeg'),
    ).rejects.toThrow('Not authenticated');
  });

  it('throws when function returns error', async () => {
    mockFetchResponse({ error: 'Invalid preset' }, false);
    await expect(
      getUploadUrl('photo.jpg', 'bad', 'image/jpeg'),
    ).rejects.toThrow('Invalid preset');
  });
});

describe('triggerProcessing', () => {
  it('POSTs key and docId to process-image-background', async () => {
    mockFetchResponse({ ok: true });
    await triggerProcessing('raw/id.jpg', 'doc-1');
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/.netlify/functions/process-image-background');
    expect(JSON.parse(options.body)).toEqual({
      key: 'raw/id.jpg',
      docId: 'doc-1',
    });
  });
});

describe('deleteMedia', () => {
  it('POSTs docId to delete-media', async () => {
    mockFetchResponse({ ok: true });
    await deleteMedia('doc-1');
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/.netlify/functions/delete-media');
    expect(JSON.parse(options.body)).toEqual({ docId: 'doc-1' });
  });
});

describe('getMediaLibrary', () => {
  it('returns ready and pending-recent items', async () => {
    const recent = new Date().toISOString();
    const stale = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    getDocs.mockResolvedValue({
      forEach: (cb) => {
        cb({ id: '1', data: () => ({ status: 'ready', createdAt: recent }) });
        cb({ id: '2', data: () => ({ status: 'pending', createdAt: recent }) });
        cb({ id: '3', data: () => ({ status: 'pending', createdAt: stale }) });
      },
    });
    const items = await getMediaLibrary();
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.id)).toEqual(['1', '2']);
  });

  it('calls deleteDoc for stale pending docs', async () => {
    const stale = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    getDocs.mockResolvedValue({
      forEach: (cb) => {
        cb({
          id: 'stale-1',
          data: () => ({ status: 'pending', createdAt: stale }),
        });
      },
    });
    await getMediaLibrary();
    expect(deleteDoc).toHaveBeenCalledTimes(1);
  });
});

describe('watchMediaDoc', () => {
  it('calls onSnapshot and invokes callback with doc data', () => {
    const mockUnsub = jest.fn();
    onSnapshot.mockImplementation((ref, cb) => {
      cb({
        exists: () => true,
        id: 'doc-1',
        data: () => ({ status: 'ready' }),
      });
      return mockUnsub;
    });
    const callback = jest.fn();
    const unsub = watchMediaDoc('doc-1', callback);
    expect(callback).toHaveBeenCalledWith({ id: 'doc-1', status: 'ready' });
    expect(unsub).toBe(mockUnsub);
  });
});
