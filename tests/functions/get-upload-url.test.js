/** @jest-environment node */

const mockVerifyIdToken = jest.fn();
const mockSet = jest.fn().mockResolvedValue({});
const mockDocFn = jest.fn().mockReturnValue({ set: mockSet });
const mockCollectionFn = jest.fn().mockReturnValue({ doc: mockDocFn });
const mockGetFirestore = jest
  .fn()
  .mockReturnValue({ collection: mockCollectionFn });
const mockGetSignedUrl = jest
  .fn()
  .mockResolvedValue('https://r2.example.com/presigned-put');
const mockSend = jest.fn().mockResolvedValue({});

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
  PutObjectCommand: jest
    .fn()
    .mockImplementation((params) => ({ ...params, _type: 'PutObjectCommand' })),
}));
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}));

process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
process.env.R2_ACCESS_KEY_ID = 'key';
process.env.R2_SECRET_ACCESS_KEY = 'secret';
process.env.R2_BUCKET_NAME = 'test-bucket';
process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 =
  Buffer.from('{}').toString('base64');

const { handler } = require('../../netlify/functions/get-upload-url.js');

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
  mockGetSignedUrl.mockResolvedValue('https://r2.example.com/presigned-put');
  mockSet.mockResolvedValue({});
});

describe('get-upload-url', () => {
  it('returns 405 for non-POST', async () => {
    const res = await handler({ httpMethod: 'GET', headers: {}, body: '' });
    expect(res.statusCode).toBe(405);
  });

  it('returns 401 when no auth header', async () => {
    const res = await handler({ httpMethod: 'POST', headers: {}, body: '{}' });
    expect(res.statusCode).toBe(401);
  });

  it('returns 403 when token has no role', async () => {
    mockVerifyIdToken.mockResolvedValue({ uid: 'user-1', role: undefined });
    const res = await handler(
      makeEvent({ displayName: 'a.jpg', mimeType: 'image/jpeg' }),
    );
    expect(res.statusCode).toBe(403);
  });

  it('returns 400 when mimeType is not an image', async () => {
    const res = await handler(
      makeEvent({ displayName: 'a.pdf', mimeType: 'application/pdf' }),
    );
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/mimeType/);
  });

  it('returns 400 when displayName is missing', async () => {
    const res = await handler(makeEvent({ mimeType: 'image/jpeg' }));
    expect(res.statusCode).toBe(400);
  });

  it('returns uploadUrl, key, docId on valid input', async () => {
    const res = await handler(
      makeEvent({ displayName: 'photo.jpg', mimeType: 'image/jpeg' }),
    );
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.uploadUrl).toBe('https://r2.example.com/presigned-put');
    expect(body.key).toMatch(/^raw\/.+\.jpg$/);
    expect(typeof body.docId).toBe('string');
    expect(body.docId).toHaveLength(36); // UUID
  });

  it('creates Firestore doc with status pending', async () => {
    await handler(
      makeEvent({ displayName: 'photo.jpg', mimeType: 'image/jpeg' }),
    );
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'pending',
        originalName: 'photo.jpg',
        mimeType: 'image/jpeg',
        rawExt: 'jpg',
        uploadedBy: 'user-1',
      }),
    );
  });

  it('accepts all valid mimeTypes', async () => {
    const types = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ];
    for (const mimeType of types) {
      const res = await handler(
        makeEvent({ displayName: 'img.png', mimeType }),
      );
      expect(res.statusCode).toBe(200);
    }
  });
});
