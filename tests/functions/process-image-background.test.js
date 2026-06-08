/** @jest-environment node */

const mockVerifyIdToken = jest.fn();
const mockSend = jest.fn();
const mockDocGet = jest.fn();
const mockDocUpdate = jest.fn().mockResolvedValue({});
const mockDocFn = jest
  .fn()
  .mockReturnValue({ get: mockDocGet, update: mockDocUpdate });
const mockCollectionFn = jest.fn().mockReturnValue({ doc: mockDocFn });
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([{}]),
  cert: jest.fn(),
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({ verifyIdToken: mockVerifyIdToken }),
}));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn().mockReturnValue({ collection: mockCollectionFn }),
}));
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  GetObjectCommand: jest
    .fn()
    .mockImplementation((p) => ({ ...p, _type: 'Get' })),
  PutObjectCommand: jest
    .fn()
    .mockImplementation((p) => ({ ...p, _type: 'Put' })),
  DeleteObjectCommand: jest
    .fn()
    .mockImplementation((p) => ({ ...p, _type: 'Del' })),
}));

const mockSharpInstance = {
  resize: jest.fn().mockReturnThis(),
  webp: jest.fn().mockReturnThis(),
  withMetadata: jest.fn().mockReturnThis(),
  toBuffer: jest.fn().mockResolvedValue({
    data: Buffer.from('processed-image'),
    info: { width: 1200, height: 900, size: 102400 },
  }),
};
jest.mock('sharp', () => jest.fn().mockReturnValue(mockSharpInstance));

process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
process.env.R2_ACCESS_KEY_ID = 'key';
process.env.R2_SECRET_ACCESS_KEY = 'secret';
process.env.R2_BUCKET_NAME = 'test-bucket';
process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 =
  Buffer.from('{}').toString('base64');

const {
  handler,
} = require('../../netlify/functions/process-image-background.js');

function makeAsyncIterable(buffer) {
  return {
    [Symbol.asyncIterator]: async function* () {
      yield buffer;
    },
  };
}

function makeEvent(body, token = 'valid-token') {
  return {
    httpMethod: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockVerifyIdToken.mockResolvedValue({
    uid: 'user-1',
    role: 'content_manager',
  });
  mockDocGet.mockResolvedValue({
    exists: true,
    data: () => ({ preset: 'gallery', status: 'pending' }),
  });
  mockSend.mockImplementation((cmd) => {
    if (cmd._type === 'Get') {
      return Promise.resolve({
        Body: makeAsyncIterable(Buffer.from('raw-image')),
      });
    }
    return Promise.resolve({});
  });
  mockSharpInstance.toBuffer.mockResolvedValue({
    data: Buffer.from('processed-image'),
    info: { width: 1200, height: 900, size: 102400 },
  });
});

describe('process-image-background', () => {
  it('returns 405 for non-POST', async () => {
    const res = await handler({ httpMethod: 'GET', headers: {}, body: '' });
    expect(res.statusCode).toBe(405);
  });

  it('returns 401 when no auth header', async () => {
    const res = await handler({ httpMethod: 'POST', headers: {}, body: '{}' });
    expect(res.statusCode).toBe(401);
  });

  it('returns 400 when key or docId is missing', async () => {
    const res = await handler(makeEvent({ key: 'raw/abc.jpg' }));
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 when media doc not found', async () => {
    mockDocGet.mockResolvedValueOnce({ exists: false });
    const res = await handler(
      makeEvent({ key: 'raw/abc.jpg', docId: 'missing' }),
    );
    expect(res.statusCode).toBe(404);
  });

  it('processes image with gallery preset dimensions', async () => {
    await handler(makeEvent({ key: 'raw/abc.jpg', docId: 'doc-1' }));
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(1200, 900, {
      fit: 'cover',
      position: 'center',
    });
    expect(mockSharpInstance.webp).toHaveBeenCalledWith({ quality: 80 });
    expect(mockSharpInstance.withMetadata).toHaveBeenCalledWith(false);
    expect(mockSharpInstance.toBuffer).toHaveBeenCalledWith({
      resolveWithObject: true,
    });
  });

  it('uploads processed image to R2 at media/<docId>.webp', async () => {
    await handler(makeEvent({ key: 'raw/abc.jpg', docId: 'doc-1' }));
    const putCall = mockSend.mock.calls.find((c) => c[0]._type === 'Put');
    expect(putCall[0].Key).toBe('media/doc-1.webp');
    expect(putCall[0].ContentType).toBe('image/webp');
  });

  it('deletes raw file from R2 after processing', async () => {
    await handler(makeEvent({ key: 'raw/abc.jpg', docId: 'doc-1' }));
    const delCall = mockSend.mock.calls.find((c) => c[0]._type === 'Del');
    expect(delCall[0].Key).toBe('raw/abc.jpg');
  });

  it('updates Firestore doc with status ready', async () => {
    await handler(makeEvent({ key: 'raw/abc.jpg', docId: 'doc-1' }));
    expect(mockDocUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ready',
        imageUrl: 'https://cdn.example.com/media/doc-1.webp',
        width: 1200,
        height: 900,
        sizeBytes: 102400,
      }),
    );
  });

  it('sets status error on Firestore doc when Sharp throws', async () => {
    mockSharpInstance.toBuffer.mockRejectedValueOnce(new Error('Sharp failed'));
    await handler(makeEvent({ key: 'raw/abc.jpg', docId: 'doc-err' }));
    expect(mockDocUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        errorMessage: 'Sharp failed',
      }),
    );
  });
});
