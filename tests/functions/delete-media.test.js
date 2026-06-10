/** @jest-environment node */

const mockVerifyIdToken = jest.fn();
const mockSend = jest.fn().mockResolvedValue({});
const mockDocGet = jest.fn();
const mockDocDelete = jest.fn().mockResolvedValue({});
const mockDocFn = jest
  .fn()
  .mockReturnValue({ get: mockDocGet, delete: mockDocDelete });
const mockCollectionFn = jest.fn().mockReturnValue({ doc: mockDocFn });
const mockGetFirestore = jest
  .fn()
  .mockReturnValue({ collection: mockCollectionFn });

jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn().mockReturnValue([{}]),
  cert: jest.fn(),
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn().mockReturnValue({ verifyIdToken: mockVerifyIdToken }),
}));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: mockGetFirestore,
}));
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: mockSend })),
  DeleteObjectCommand: jest
    .fn()
    .mockImplementation((p) => ({ ...p, _type: 'DeleteObjectCommand' })),
}));

process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
process.env.R2_ACCESS_KEY_ID = 'key';
process.env.R2_SECRET_ACCESS_KEY = 'secret';
process.env.R2_BUCKET_NAME = 'test-bucket';
process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 =
  Buffer.from('{}').toString('base64');

const { handler } = require('../../netlify/functions/delete-media.js');

function makeEvent(body, token = 'valid-token') {
  return {
    httpMethod: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockVerifyIdToken.mockResolvedValue({ uid: 'user-1', role: 'admin' });
  // No rawExt or originalName — raw deletion will be skipped
  mockDocGet.mockResolvedValue({
    exists: true,
    data: () => ({ status: 'ready' }),
  });
  mockSend.mockResolvedValue({});
});

describe('delete-media', () => {
  it('returns 405 for non-POST', async () => {
    const res = await handler({ httpMethod: 'GET', headers: {}, body: '' });
    expect(res.statusCode).toBe(405);
  });

  it('returns 401 when no auth header', async () => {
    const res = await handler({ httpMethod: 'POST', headers: {}, body: '{}' });
    expect(res.statusCode).toBe(401);
  });

  it('returns 400 when docId is missing', async () => {
    const res = await handler(makeEvent({}));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/docId/);
  });

  it('returns 404 when Firestore doc does not exist', async () => {
    mockDocGet.mockResolvedValue({ exists: false });
    const res = await handler(makeEvent({ docId: 'missing-id' }));
    expect(res.statusCode).toBe(404);
  });

  it('deletes all R2 variants and Firestore doc', async () => {
    const res = await handler(makeEvent({ docId: 'doc-123' }));
    expect(res.statusCode).toBe(200);
    // 3 size variants + 1 backwards-compat single-file = 4 calls (no rawExt so raw skipped)
    expect(mockSend).toHaveBeenCalledTimes(4);
    const keys = mockSend.mock.calls.map((c) => c[0].Key).sort();
    expect(keys).toEqual([
      'media/doc-123.webp',
      'media/doc-123/gallery.webp',
      'media/doc-123/hero.webp',
      'media/doc-123/thumbnail.webp',
    ]);
    expect(mockDocDelete).toHaveBeenCalledTimes(1);
  });

  it('also deletes raw file when rawExt is present', async () => {
    mockDocGet.mockResolvedValue({
      exists: true,
      data: () => ({ status: 'ready', rawExt: 'jpg' }),
    });
    const res = await handler(makeEvent({ docId: 'doc-456' }));
    expect(res.statusCode).toBe(200);
    // 3 size variants + 1 backwards-compat + 1 raw = 5 calls
    expect(mockSend).toHaveBeenCalledTimes(5);
    const keys = mockSend.mock.calls.map((c) => c[0].Key);
    expect(keys).toContain('raw/doc-456.jpg');
  });

  it('treats R2 NoSuchKey as success (idempotent)', async () => {
    const notFoundErr = new Error('not found');
    notFoundErr.name = 'NoSuchKey';
    mockSend.mockRejectedValueOnce(notFoundErr);
    const res = await handler(makeEvent({ docId: 'gone-id' }));
    expect(res.statusCode).toBe(200);
    expect(mockDocDelete).toHaveBeenCalledTimes(1);
  });

  it('returns 200 with ok: true on success', async () => {
    const res = await handler(makeEvent({ docId: 'doc-456' }));
    expect(JSON.parse(res.body)).toEqual({ ok: true });
  });
});
