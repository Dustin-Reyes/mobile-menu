# Media Upload & Gallery Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build direct-to-R2 image upload with background Sharp processing, Firestore status tracking, a full Media Library UI, and gallery item integration in the CMS.

**Architecture:** Browser calls `get-upload-url` to receive a presigned R2 PUT URL, uploads directly to R2 (no Netlify size limit), then calls `process-image-background` which runs Sharp async and writes the result back to R2. Status is tracked in Firestore and surfaced via `onSnapshot`. Gallery items live in the `pages/home` Firestore document alongside existing CMS content.

**Tech Stack:** Netlify Functions (sync + background), `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `sharp`, Firebase Admin SDK (functions), Firebase Client SDK (frontend), Emotion styled components, React hooks.

**Spec:** `docs/superpowers/specs/2026-06-08-media-upload-design.md`

---

## File Map

### New files
| File | Purpose |
|---|---|
| `netlify/functions/lib/presets.js` | Named processing presets (gallery/thumbnail/hero) |
| `netlify/functions/lib/firebase-admin.js` | Firebase Admin app singleton + `adminAuth()` / `adminDb()` |
| `netlify/functions/lib/auth.js` | `verifyMediaCaller(event)` — token verification + role check |
| `netlify/functions/lib/r2.js` | R2 `S3Client` singleton + env helpers |
| `netlify/functions/get-upload-url.js` | Presigned PUT URL + Firestore doc creation |
| `netlify/functions/process-image-background.js` | Sharp processing + R2 write + Firestore update |
| `netlify/functions/delete-media.js` | R2 delete + Firestore delete |
| `src/services/media.js` | Client-side service: calls functions + Firestore queries |
| `src/hooks/useMedia.js` | `useMediaLibrary()` + `useUpload()` hooks |
| `src/components/admin/media/MediaPicker.jsx` | Image selection modal for gallery item editor |
| `tests/functions/presets.test.js` | Preset config unit tests |
| `tests/functions/get-upload-url.test.js` | Function integration tests (mocked deps) |
| `tests/functions/delete-media.test.js` | Function integration tests (mocked deps) |
| `tests/functions/process-image-background.test.js` | Function integration tests (mocked deps) |
| `tests/services/media.test.js` | Service unit tests |
| `tests/hooks/useMedia.test.js` | Hook unit tests |
| `tests/e2e/media.spec.js` | Playwright E2E tests |

### Modified files
| File | Change |
|---|---|
| `netlify.toml` | Sharp external module config + CSP updates |
| `src/components/admin/tabs/MediaTab.jsx` | Full rebuild — upload zone + media library grid |
| `src/components/admin/content/ContentFieldEditor.jsx` | Add `GalleryItemsEditor` component + render case |
| `src/content/schema.js` | Add `galleryItems` field to home page |
| `src/content/pages.js` | Add `items: []` to `home.en.gallery` |
| `src/components/sections/Gallery.jsx` | Render real `<img>` when `item.imageUrl` present |

---

## Task 1: Install dependencies + configure Sharp in netlify.toml

**Files:**
- Modify: `package.json`
- Modify: `netlify.toml`

- [ ] **Step 1: Install AWS SDK + Sharp**

```bash
yarn add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner sharp
```

Expected: packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify Sharp installs cleanly**

```bash
node -e "require('sharp'); console.log('sharp ok')"
```

Expected: prints `sharp ok`.

- [ ] **Step 3: Configure netlify.toml for Sharp**

In `netlify.toml`, add below the existing `[functions]` block:

```toml
[functions."process-image-background"]
  external_node_modules = ["sharp"]
  included_files = ["node_modules/sharp/**", "node_modules/@img/**"]
```

Sharp 0.33+ ships native binaries under `@img/sharp-*` packages. The `included_files` directive bundles them with the Lambda function.

- [ ] **Step 4: Commit**

```bash
git add package.json yarn.lock netlify.toml
git commit -m "chore(media): install @aws-sdk/client-s3, presigner, and sharp"
```

---

## Task 2: Create shared function libs

**Files:**
- Create: `netlify/functions/lib/presets.js`
- Create: `netlify/functions/lib/firebase-admin.js`
- Create: `netlify/functions/lib/auth.js`
- Create: `netlify/functions/lib/r2.js`
- Create: `tests/functions/presets.test.js`

- [ ] **Step 1: Write failing test for presets**

Create `tests/functions/presets.test.js`:

```js
/** @jest-environment node */
import { PRESETS, VALID_PRESETS } from '../../netlify/functions/lib/presets.js';

describe('PRESETS', () => {
  it('defines gallery, thumbnail, hero', () => {
    expect(VALID_PRESETS).toEqual(['gallery', 'thumbnail', 'hero']);
  });

  it('each preset has width, height, quality, fit', () => {
    for (const preset of VALID_PRESETS) {
      expect(PRESETS[preset]).toMatchObject({
        width: expect.any(Number),
        height: expect.any(Number),
        quality: expect.any(Number),
        fit: 'cover',
      });
    }
  });

  it('gallery is 1200x900 quality 80', () => {
    expect(PRESETS.gallery).toEqual({ width: 1200, height: 900, quality: 80, fit: 'cover' });
  });

  it('thumbnail is 400x300 quality 75', () => {
    expect(PRESETS.thumbnail).toEqual({ width: 400, height: 300, quality: 75, fit: 'cover' });
  });

  it('hero is 2400x1350 quality 85', () => {
    expect(PRESETS.hero).toEqual({ width: 2400, height: 1350, quality: 85, fit: 'cover' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/functions/presets.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `netlify/functions/lib/presets.js`**

```js
export const PRESETS = {
  gallery:   { width: 1200, height: 900,  quality: 80, fit: 'cover' },
  thumbnail: { width: 400,  height: 300,  quality: 75, fit: 'cover' },
  hero:      { width: 2400, height: 1350, quality: 85, fit: 'cover' },
};

export const VALID_PRESETS = Object.keys(PRESETS);
```

- [ ] **Step 4: Run test to verify it passes**

```bash
yarn test tests/functions/presets.test.js
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Create `netlify/functions/lib/firebase-admin.js`**

```js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (!b64) throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 is not set');
  const serviceAccount = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  return initializeApp({ credential: cert(serviceAccount) });
}

export const adminAuth = () => getAuth(getAdminApp());
export const adminDb = () => getFirestore(getAdminApp());
```

- [ ] **Step 6: Create `netlify/functions/lib/auth.js`**

```js
import { adminAuth } from './firebase-admin.js';

export async function verifyMediaCaller(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Missing Bearer token'), { status: 401 });
  }
  const idToken = authHeader.slice(7);
  const decoded = await adminAuth().verifyIdToken(idToken);
  if (!decoded.role) {
    throw Object.assign(new Error('Insufficient permissions'), { status: 403 });
  }
  return decoded;
}
```

- [ ] **Step 7: Create `netlify/functions/lib/r2.js`**

```js
import { S3Client } from '@aws-sdk/client-s3';

let _client = null;

export function getR2Client() {
  if (_client) return _client;
  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  return _client;
}

export const getBucketName = () => process.env.R2_BUCKET_NAME;
export const getPublicUrl = () => process.env.R2_PUBLIC_URL;
```

- [ ] **Step 8: Commit**

```bash
git add netlify/functions/lib/ tests/functions/presets.test.js
git commit -m "feat(media): add shared function libs — presets, auth, r2, firebase-admin"
```

---

## Task 3: TDD — get-upload-url function

**Files:**
- Create: `tests/functions/get-upload-url.test.js`
- Create: `netlify/functions/get-upload-url.js`

- [ ] **Step 1: Write failing tests**

Create `tests/functions/get-upload-url.test.js`:

```js
/** @jest-environment node */

const mockVerifyIdToken = jest.fn();
const mockSet = jest.fn().mockResolvedValue({});
const mockDocFn = jest.fn().mockReturnValue({ set: mockSet });
const mockCollectionFn = jest.fn().mockReturnValue({ doc: mockDocFn });
const mockGetFirestore = jest.fn().mockReturnValue({ collection: mockCollectionFn });
const mockGetSignedUrl = jest.fn().mockResolvedValue('https://r2.example.com/presigned-put');
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
  PutObjectCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'PutObjectCommand' })),
}));
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: mockGetSignedUrl,
}));

process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
process.env.R2_ACCESS_KEY_ID = 'key';
process.env.R2_SECRET_ACCESS_KEY = 'secret';
process.env.R2_BUCKET_NAME = 'test-bucket';
process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = Buffer.from('{}').toString('base64');

import { handler } from '../../netlify/functions/get-upload-url.js';

function makeEvent(body, token = 'valid-token') {
  return {
    httpMethod: 'POST',
    headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockVerifyIdToken.mockResolvedValue({ uid: 'user-1', role: 'content_manager' });
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
    const res = await handler(makeEvent({ filename: 'a.jpg', preset: 'gallery', mimeType: 'image/jpeg' }));
    expect(res.statusCode).toBe(403);
  });

  it('returns 400 when preset is invalid', async () => {
    const res = await handler(makeEvent({ filename: 'a.jpg', preset: 'invalid', mimeType: 'image/jpeg' }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/preset/);
  });

  it('returns 400 when mimeType is not an image', async () => {
    const res = await handler(makeEvent({ filename: 'a.pdf', preset: 'gallery', mimeType: 'application/pdf' }));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body).error).toMatch(/mimeType/);
  });

  it('returns 400 when filename is missing', async () => {
    const res = await handler(makeEvent({ preset: 'gallery', mimeType: 'image/jpeg' }));
    expect(res.statusCode).toBe(400);
  });

  it('returns uploadUrl, key, docId on valid input', async () => {
    const res = await handler(makeEvent({ filename: 'photo.jpg', preset: 'gallery', mimeType: 'image/jpeg' }));
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.uploadUrl).toBe('https://r2.example.com/presigned-put');
    expect(body.key).toMatch(/^raw\/.+\.jpg$/);
    expect(typeof body.docId).toBe('string');
    expect(body.docId).toHaveLength(36); // UUID
  });

  it('creates Firestore doc with status pending', async () => {
    await handler(makeEvent({ filename: 'photo.jpg', preset: 'thumbnail', mimeType: 'image/jpeg' }));
    expect(mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'pending',
        preset: 'thumbnail',
        originalName: 'photo.jpg',
        mimeType: 'image/jpeg',
        uploadedBy: 'user-1',
      }),
    );
  });

  it('accepts all valid mimeTypes', async () => {
    const types = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    for (const mimeType of types) {
      const res = await handler(makeEvent({ filename: 'img.png', preset: 'gallery', mimeType }));
      expect(res.statusCode).toBe(200);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/functions/get-upload-url.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `netlify/functions/get-upload-url.js`**

```js
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName } from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';
import { VALID_PRESETS } from './lib/presets.js';

const VALID_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let caller;
  try {
    caller = await verifyMediaCaller(event);
  } catch (e) {
    return { statusCode: e.status ?? 401, body: JSON.stringify({ error: e.message }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { filename, preset, mimeType } = body;

  if (!filename) {
    return { statusCode: 400, body: JSON.stringify({ error: 'filename is required' }) };
  }
  if (!VALID_PRESETS.includes(preset)) {
    return { statusCode: 400, body: JSON.stringify({ error: `preset must be one of: ${VALID_PRESETS.join(', ')}` }) };
  }
  if (!VALID_MIME_TYPES.has(mimeType)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid mimeType — accepted: image/jpeg, image/png, image/webp, image/avif, image/gif' }) };
  }

  const docId = randomUUID();
  const ext = filename.split('.').pop().toLowerCase();
  const key = `raw/${docId}.${ext}`;

  try {
    const r2 = getR2Client();
    const command = new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ContentType: mimeType,
    });
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    const db = adminDb();
    await db.collection('media').doc(docId).set({
      status: 'pending',
      preset,
      originalName: filename,
      mimeType,
      uploadedBy: caller.uid,
      createdAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadUrl, key, docId }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test tests/functions/get-upload-url.test.js
```

Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/get-upload-url.js tests/functions/get-upload-url.test.js
git commit -m "feat(media): add get-upload-url function"
```

---

## Task 4: TDD — delete-media function

**Files:**
- Create: `tests/functions/delete-media.test.js`
- Create: `netlify/functions/delete-media.js`

- [ ] **Step 1: Write failing tests**

Create `tests/functions/delete-media.test.js`:

```js
/** @jest-environment node */

const mockVerifyIdToken = jest.fn();
const mockSend = jest.fn().mockResolvedValue({});
const mockDocGet = jest.fn();
const mockDocDelete = jest.fn().mockResolvedValue({});
const mockDocFn = jest.fn().mockReturnValue({ get: mockDocGet, delete: mockDocDelete });
const mockCollectionFn = jest.fn().mockReturnValue({ doc: mockDocFn });
const mockGetFirestore = jest.fn().mockReturnValue({ collection: mockCollectionFn });

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
  DeleteObjectCommand: jest.fn().mockImplementation((p) => ({ ...p, _type: 'DeleteObjectCommand' })),
}));

process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
process.env.R2_ACCESS_KEY_ID = 'key';
process.env.R2_SECRET_ACCESS_KEY = 'secret';
process.env.R2_BUCKET_NAME = 'test-bucket';
process.env.R2_PUBLIC_URL = 'https://cdn.example.com';
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = Buffer.from('{}').toString('base64');

import { handler } from '../../netlify/functions/delete-media.js';

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
  mockDocGet.mockResolvedValue({ exists: true, data: () => ({ status: 'ready' }) });
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

  it('deletes R2 object and Firestore doc', async () => {
    const res = await handler(makeEvent({ docId: 'doc-123' }));
    expect(res.statusCode).toBe(200);
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockDocDelete).toHaveBeenCalledTimes(1);
    const r2Call = mockSend.mock.calls[0][0];
    expect(r2Call.Key).toBe('media/doc-123.webp');
    expect(r2Call.Bucket).toBe('test-bucket');
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/functions/delete-media.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `netlify/functions/delete-media.js`**

```js
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName } from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    await verifyMediaCaller(event);
  } catch (e) {
    return { statusCode: e.status ?? 401, body: JSON.stringify({ error: e.message }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { docId } = body;
  if (!docId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'docId is required' }) };
  }

  const db = adminDb();
  const docRef = db.collection('media').doc(docId);
  const snap = await docRef.get();

  if (!snap.exists) {
    return { statusCode: 404, body: JSON.stringify({ error: 'Media doc not found' }) };
  }

  const r2 = getR2Client();
  const key = `media/${docId}.webp`;

  try {
    await r2.send(new DeleteObjectCommand({ Bucket: getBucketName(), Key: key }));
  } catch (e) {
    if (e.name !== 'NoSuchKey') {
      return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
  }

  await docRef.delete();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test tests/functions/delete-media.test.js
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/delete-media.js tests/functions/delete-media.test.js
git commit -m "feat(media): add delete-media function"
```

---

## Task 5: Implement process-image-background function

**Files:**
- Create: `tests/functions/process-image-background.test.js`
- Create: `netlify/functions/process-image-background.js`

- [ ] **Step 1: Write failing tests**

Create `tests/functions/process-image-background.test.js`:

```js
/** @jest-environment node */

const mockVerifyIdToken = jest.fn();
const mockSend = jest.fn();
const mockDocGet = jest.fn();
const mockDocUpdate = jest.fn().mockResolvedValue({});
const mockDocFn = jest.fn().mockReturnValue({ get: mockDocGet, update: mockDocUpdate });
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
  GetObjectCommand: jest.fn().mockImplementation((p) => ({ ...p, _type: 'Get' })),
  PutObjectCommand: jest.fn().mockImplementation((p) => ({ ...p, _type: 'Put' })),
  DeleteObjectCommand: jest.fn().mockImplementation((p) => ({ ...p, _type: 'Del' })),
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
process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 = Buffer.from('{}').toString('base64');

import { handler } from '../../netlify/functions/process-image-background.js';

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
  mockVerifyIdToken.mockResolvedValue({ uid: 'user-1', role: 'content_manager' });
  mockDocGet.mockResolvedValue({
    exists: true,
    data: () => ({ preset: 'gallery', status: 'pending' }),
  });
  mockSend.mockImplementation((cmd) => {
    if (cmd._type === 'Get') {
      return Promise.resolve({ Body: makeAsyncIterable(Buffer.from('raw-image')) });
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

  it('returns 400 when key or docId is missing', async () => {
    const res = await handler(makeEvent({ key: 'raw/abc.jpg' }));
    expect(res.statusCode).toBe(400);
  });

  it('processes image with gallery preset dimensions', async () => {
    await handler(makeEvent({ key: 'raw/abc.jpg', docId: 'doc-1' }));
    expect(mockSharpInstance.resize).toHaveBeenCalledWith(1200, 900, { fit: 'cover', position: 'center' });
    expect(mockSharpInstance.webp).toHaveBeenCalledWith({ quality: 80 });
    expect(mockSharpInstance.withMetadata).toHaveBeenCalledWith(false);
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
      expect.objectContaining({ status: 'error', errorMessage: 'Sharp failed' }),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/functions/process-image-background.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `netlify/functions/process-image-background.js`**

```js
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { verifyMediaCaller } from './lib/auth.js';
import { getR2Client, getBucketName, getPublicUrl } from './lib/r2.js';
import { adminDb } from './lib/firebase-admin.js';
import { PRESETS } from './lib/presets.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    await verifyMediaCaller(event);
  } catch (e) {
    return { statusCode: e.status ?? 401, body: JSON.stringify({ error: e.message }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { key, docId } = body;
  if (!key || !docId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'key and docId are required' }) };
  }

  const db = adminDb();
  const docRef = db.collection('media').doc(docId);

  try {
    const snap = await docRef.get();
    if (!snap.exists) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Media doc not found' }) };
    }

    const { preset } = snap.data();
    const { width, height, quality, fit } = PRESETS[preset] ?? PRESETS.gallery;

    const r2 = getR2Client();
    const bucket = getBucketName();

    const { Body } = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const chunks = [];
    for await (const chunk of Body) chunks.push(chunk);
    const inputBuffer = Buffer.concat(chunks);

    const { data: outputBuffer, info } = await sharp(inputBuffer)
      .resize(width, height, { fit, position: 'center' })
      .webp({ quality })
      .withMetadata(false)
      .toBuffer({ resolveWithObject: true });

    const processedKey = `media/${docId}.webp`;
    await r2.send(new PutObjectCommand({
      Bucket: bucket,
      Key: processedKey,
      Body: outputBuffer,
      ContentType: 'image/webp',
    }));

    await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

    await docRef.update({
      status: 'ready',
      imageUrl: `${getPublicUrl()}/${processedKey}`,
      width: info.width,
      height: info.height,
      sizeBytes: info.size,
      processedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    await docRef.update({ status: 'error', errorMessage: error.message }).catch(() => {});
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test tests/functions/process-image-background.test.js
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add netlify/functions/process-image-background.js tests/functions/process-image-background.test.js
git commit -m "feat(media): add process-image-background function"
```

---

## Task 6: TDD — media.js service

**Files:**
- Create: `tests/services/media.test.js`
- Create: `src/services/media.js`

- [ ] **Step 1: Write failing tests**

Create `tests/services/media.test.js`:

```js
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
  uploadToR2,
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
    mockFetchResponse({ uploadUrl: 'https://r2.example.com/put', key: 'raw/id.jpg', docId: 'id-1' });
    const result = await getUploadUrl('photo.jpg', 'gallery', 'image/jpeg');
    expect(result).toEqual({ uploadUrl: 'https://r2.example.com/put', key: 'raw/id.jpg', docId: 'id-1' });
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/.netlify/functions/get-upload-url');
    expect(options.headers['Authorization']).toBe('Bearer test-token');
    expect(JSON.parse(options.body)).toEqual({ filename: 'photo.jpg', preset: 'gallery', mimeType: 'image/jpeg' });
  });

  it('throws when not authenticated', async () => {
    auth.currentUser = null;
    await expect(getUploadUrl('photo.jpg', 'gallery', 'image/jpeg')).rejects.toThrow('Not authenticated');
  });

  it('throws when function returns error', async () => {
    mockFetchResponse({ error: 'Invalid preset' }, false);
    await expect(getUploadUrl('photo.jpg', 'bad', 'image/jpeg')).rejects.toThrow('Invalid preset');
  });
});

describe('triggerProcessing', () => {
  it('POSTs key and docId to process-image-background', async () => {
    mockFetchResponse({ ok: true });
    await triggerProcessing('raw/id.jpg', 'doc-1');
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('/.netlify/functions/process-image-background');
    expect(JSON.parse(options.body)).toEqual({ key: 'raw/id.jpg', docId: 'doc-1' });
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
        cb({ id: 'stale-1', data: () => ({ status: 'pending', createdAt: stale }) });
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
      cb({ exists: () => true, id: 'doc-1', data: () => ({ status: 'ready' }) });
      return mockUnsub;
    });
    const callback = jest.fn();
    const unsub = watchMediaDoc('doc-1', callback);
    expect(callback).toHaveBeenCalledWith({ id: 'doc-1', status: 'ready' });
    expect(unsub).toBe(mockUnsub);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/services/media.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/services/media.js`**

```js
import { auth, db } from 'config/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import globalErrorHandler from 'utils/errorHandler';

const ONE_HOUR_MS = 60 * 60 * 1000;

async function getAuthHeader() {
  const user = auth?.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function callFunction(name, body) {
  const headers = await getAuthHeader();
  const res = await fetch(`/.netlify/functions/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `${name} failed`);
  return data;
}

export function getUploadUrl(filename, preset, mimeType) {
  return callFunction('get-upload-url', { filename, preset, mimeType });
}

export function uploadToR2(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`R2 upload failed: ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error('R2 upload network error'));
    xhr.send(file);
  });
}

export function triggerProcessing(key, docId) {
  return callFunction('process-image-background', { key, docId });
}

export function deleteMedia(docId) {
  return callFunction('delete-media', { docId });
}

export async function getMediaLibrary() {
  if (!db) return [];
  const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const now = Date.now();
  const items = [];
  const staleIds = [];

  snap.forEach((d) => {
    const data = d.data();
    const isStale =
      data.status === 'pending' &&
      now - new Date(data.createdAt).getTime() > ONE_HOUR_MS;
    if (isStale) {
      staleIds.push(d.id);
    } else {
      items.push({ id: d.id, ...data });
    }
  });

  staleIds.forEach((id) =>
    deleteDoc(doc(db, 'media', id)).catch((e) =>
      globalErrorHandler.reportError(e, { action: 'clean-stale-media', id }),
    ),
  );

  return items;
}

export function watchMediaDoc(docId, callback) {
  if (!db) return () => {};
  const docRef = doc(db, 'media', docId);
  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test tests/services/media.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/media.js tests/services/media.test.js
git commit -m "feat(media): add media service"
```

---

## Task 7: TDD — useMedia.js hooks

**Files:**
- Create: `tests/hooks/useMedia.test.js`
- Create: `src/hooks/useMedia.js`

- [ ] **Step 1: Write failing tests**

Create `tests/hooks/useMedia.test.js`:

```js
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

const READY_ITEM = { id: 'img-1', status: 'ready', imageUrl: 'https://cdn.example.com/media/img-1.webp', originalName: 'photo.jpg' };

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
      cb({ id: docId, status: 'ready', imageUrl: 'https://cdn.example.com/media/doc-1.webp' });
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
    let uploadingDuring = false;
    mediaService.uploadToR2.mockImplementation(async (url, file, onProgress) => {
      // Capture state mid-upload — can't easily snapshot async React state here,
      // so we verify the final state instead
      onProgress(50);
    });
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
      await expect(result.current.upload(mockFile, 'gallery')).rejects.toThrow('Sharp failed');
    });
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.uploading).toBe(false);
  });

  it('calls getUploadUrl, uploadToR2, triggerProcessing in order', async () => {
    const order = [];
    mediaService.getUploadUrl.mockImplementation(async () => { order.push('getUploadUrl'); return { uploadUrl: 'u', key: 'k', docId: 'd' }; });
    mediaService.uploadToR2.mockImplementation(async () => { order.push('uploadToR2'); });
    mediaService.triggerProcessing.mockImplementation(async () => { order.push('triggerProcessing'); return {}; });
    mediaService.watchMediaDoc.mockImplementation((id, cb) => { cb({ id, status: 'ready' }); return mockUnsub; });
    const { result } = renderHook(() => useUpload());
    await act(async () => { await result.current.upload(mockFile, 'gallery'); });
    expect(order).toEqual(['getUploadUrl', 'uploadToR2', 'triggerProcessing']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
yarn test tests/hooks/useMedia.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `src/hooks/useMedia.js`**

```js
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getUploadUrl,
  uploadToR2,
  triggerProcessing,
  getMediaLibrary,
  watchMediaDoc,
} from 'services/media';
import globalErrorHandler from 'utils/errorHandler';

export function useMediaLibrary() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMediaLibrary();
      setItems(data);
    } catch (e) {
      setError(e);
      globalErrorHandler.reportError(e, { hook: 'useMediaLibrary' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);

  const upload = useCallback(async (file, preset = 'gallery') => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const { uploadUrl, key, docId } = await getUploadUrl(file.name, preset, file.type);
      await uploadToR2(uploadUrl, file, setProgress);
      await triggerProcessing(key, docId);

      return new Promise((resolve, reject) => {
        const unsub = watchMediaDoc(docId, (mediaDoc) => {
          if (mediaDoc.status === 'ready') {
            unsub();
            unsubRef.current = null;
            setUploading(false);
            resolve(mediaDoc);
          } else if (mediaDoc.status === 'error') {
            unsub();
            unsubRef.current = null;
            const err = new Error(mediaDoc.errorMessage ?? 'Processing failed');
            setError(err);
            setUploading(false);
            reject(err);
          }
        });
        unsubRef.current = unsub;
      });
    } catch (e) {
      setError(e);
      setUploading(false);
      throw e;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  return { upload, uploading, progress, error };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
yarn test tests/hooks/useMedia.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useMedia.js tests/hooks/useMedia.test.js
git commit -m "feat(media): add useMediaLibrary and useUpload hooks"
```

---

## Task 8: Gallery data layer — schema, pages, Gallery.jsx

**Files:**
- Modify: `src/content/schema.js`
- Modify: `src/content/pages.js`
- Modify: `src/components/sections/Gallery.jsx`

- [ ] **Step 1: Add galleryItems to schema.js**

In `src/content/schema.js`, after the `gallerySubtitle` field entry (around line 107), add:

```js
      {
        key: 'galleryItems',
        label: 'Gallery Items',
        type: 'gallery-items',
        group: 'Gallery',
      },
```

The Gallery group block should then read:
```js
      { key: 'galleryTitle',    label: 'Gallery Section Title',    type: 'text',          group: 'Gallery' },
      { key: 'gallerySubtitle', label: 'Gallery Section Subtitle', type: 'textarea',      group: 'Gallery' },
      { key: 'galleryItems',    label: 'Gallery Items',            type: 'gallery-items', group: 'Gallery' },
```

- [ ] **Step 2: Add items: [] to pages.js**

In `src/content/pages.js`, find the `gallery` block under `home.en` (around line 62) and add `items: []`:

```js
      gallery: {
        title: 'Our Work',
        subtitle: 'Explore our portfolio and see what we can create for you',
        items: [],
      },
```

- [ ] **Step 3: Update Gallery.jsx to render real images**

Replace the `GalleryImage` styled component and the `<GalleryImage>` JSX in `src/components/sections/Gallery.jsx`.

Replace the existing `GalleryImage` styled component (lines 77-87):

```js
const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const GalleryPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.s3};
  text-align: center;
  padding: 1rem;
`;
```

Replace the `<GalleryImage>{item.title}</GalleryImage>` line inside `galleryItems.map` with:

```jsx
{item.imageUrl ? (
  <GalleryImage src={item.imageUrl} alt={item.title} loading="lazy" />
) : (
  <GalleryPlaceholder>{item.title}</GalleryPlaceholder>
)}
```

- [ ] **Step 4: Run all tests to check for regressions**

```bash
yarn test
```

Expected: all existing tests pass. Fix any failures before continuing.

- [ ] **Step 5: Commit**

```bash
git add src/content/schema.js src/content/pages.js src/components/sections/Gallery.jsx
git commit -m "feat(media): add galleryItems schema field and render real images in Gallery"
```

---

## Task 9: MediaPicker component

**Files:**
- Create: `src/components/admin/media/MediaPicker.jsx`

- [ ] **Step 1: Create the component**

Create `src/components/admin/media/MediaPicker.jsx`:

```jsx
import { useState } from 'react';
import styled from '@emotion/styled';
import * as RadixDialog from '@radix-ui/react-dialog';
import { DialogRoot, DialogPortal, DialogOverlay } from 'components/ui/Dialog';
import { useMediaLibrary } from 'hooks/useMedia';
import LoadingSpinner from 'components/admin/shared/LoadingSpinner';

const Content = styled(RadixDialog.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s3};
  padding: 20px;
  width: 90%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  z-index: ${(p) => p.theme.zIndex.modal};
  outline: none;

  @media (max-width: 768px) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    transform: none;
    border-radius: 20px 20px 0 0;
    max-height: 70vh;
  }
`;

const Title = styled(RadixDialog.Title)`
  font-size: ${(p) => p.theme.typography.fontSizes.s4};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImageCard = styled.button`
  aspect-ratio: 4 / 3;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(p) => p.theme.colors.border};
  padding: 0;
  background: ${(p) => p.theme.colors.background};
  transition: border-color 0.15s, transform 0.15s;

  &:hover {
    border-color: ${(p) => p.theme.colors.primary};
    transform: scale(1.02);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const EmptyState = styled.p`
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-align: center;
  padding: 2rem 0;
  margin: 0;
`;

/**
 * Modal for selecting a ready image from the media library.
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {function} props.onSelect - Called with the full media item object
 */
export default function MediaPicker({ open, onClose, onSelect }) {
  const { items, loading } = useMediaLibrary();
  const readyItems = items.filter((item) => item.status === 'ready');

  return (
    <DialogRoot open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogOverlay />
        <Content>
          <Title>Select Image</Title>
          {loading ? (
            <LoadingSpinner />
          ) : readyItems.length === 0 ? (
            <EmptyState>No images yet — upload some in the Media tab first.</EmptyState>
          ) : (
            <Grid>
              {readyItems.map((item) => (
                <ImageCard
                  key={item.id}
                  onClick={() => { onSelect(item); onClose(); }}
                  title={item.originalName}
                >
                  <img src={item.imageUrl} alt={item.originalName} loading="lazy" />
                </ImageCard>
              ))}
            </Grid>
          )}
        </Content>
      </DialogPortal>
    </DialogRoot>
  );
}
```

- [ ] **Step 2: Run lint and format**

```bash
yarn format && yarn lint
```

Fix any reported issues.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/media/MediaPicker.jsx
git commit -m "feat(media): add MediaPicker component"
```

---

## Task 10: Add gallery-items type to ContentFieldEditor

**Files:**
- Modify: `src/components/admin/content/ContentFieldEditor.jsx`

- [ ] **Step 1: Add GalleryItemsEditor component**

In `src/components/admin/content/ContentFieldEditor.jsx`, after the closing `}` of `ServiceItemsEditor` (around line 309), add the new component. First add the `MediaPicker` import at the top of the file alongside the other imports (`useState` is already imported):

```js
import MediaPicker from 'components/admin/media/MediaPicker';
```

Then add the `GalleryItemsEditor` component after `ServiceItemsEditor`:

```jsx
// ─── Gallery Items Editor ─────────────────────────────────────────────────────

const GalleryImagePreview = styled.div`
  width: 64px;
  height: 48px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  overflow: hidden;
  border: 1px solid ${(p) => p.theme.colors.border};
  flex-shrink: 0;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImagePickerBtn = styled.button`
  padding: 4px 10px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: transparent;
  color: ${(p) => p.theme.colors.textSecondary};
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: ${(p) => p.theme.colors.primary}60;
    color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const GalleryImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

/**
 * Editable list of gallery items with title, description, and image assignment.
 * @param {Object} props
 * @param {Array<{title: string, description: string, imageUrl?: string}>} props.value
 * @param {function} props.onChange
 * @param {boolean} [props.disabled]
 * @param {number} [props.maxItems]
 */
export function GalleryItemsEditor({ value, onChange, disabled, maxItems }) {
  const items = Array.isArray(value) ? value : [];
  const atLimit = maxItems != null && items.length >= maxItems;
  const [pickerIndex, setPickerIndex] = useState(null);

  const updateItem = (index, field, val) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  };

  const addItem = () => {
    onChange([...items, { title: '', description: '', imageUrl: '' }]);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      {items.map((item, index) => (
        <FaqItemCard key={index}>
          <FaqItemRow>
            <FaqItemFields>
              <GalleryImageRow>
                <GalleryImagePreview>
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title || 'Gallery image'} />
                  ) : null}
                </GalleryImagePreview>
                <ImagePickerBtn
                  type="button"
                  onClick={() => setPickerIndex(index)}
                  disabled={disabled}
                >
                  {item.imageUrl ? 'Change image' : 'Pick image'}
                </ImagePickerBtn>
              </GalleryImageRow>
              <div>
                <FaqItemLabel>Title</FaqItemLabel>
                <Input
                  value={item.title ?? ''}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  disabled={disabled}
                  placeholder="Gallery item title…"
                />
              </div>
              <div>
                <FaqItemLabel>Description</FaqItemLabel>
                <StyledTextarea
                  value={item.description ?? ''}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  disabled={disabled}
                  placeholder="Short description…"
                  style={{ minHeight: 52 }}
                />
              </div>
            </FaqItemFields>
            <RemoveItemBtn
              onClick={() => removeItem(index)}
              disabled={disabled}
              title="Remove item"
              aria-label="Remove gallery item"
            >
              ×
            </RemoveItemBtn>
          </FaqItemRow>
        </FaqItemCard>
      ))}
      <AddItemBtn onClick={addItem} disabled={disabled || atLimit}>
        {atLimit ? `Max ${maxItems} items reached` : '＋ Add Gallery Item'}
      </AddItemBtn>
      <MediaPicker
        open={pickerIndex !== null}
        onClose={() => setPickerIndex(null)}
        onSelect={(mediaItem) => {
          if (pickerIndex !== null) updateItem(pickerIndex, 'imageUrl', mediaItem.imageUrl);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add the gallery-items render case to DesktopEditor and MobileEditor**

Find the block in `DesktopEditor` that renders field types (around line 537). After the `service-items` case, add:

```jsx
) : field.type === 'gallery-items' ? (
  <GalleryItemsEditor
    value={formValues[field.key] ?? []}
    onChange={(arr) => onFieldChange(field.key, arr)}
    disabled={isLoading}
    maxItems={field.maxItems}
  />
```

Do the same in `MobileEditor` — find the same conditional block and add the gallery-items case in the same position.

- [ ] **Step 3: Run format + lint + tests**

```bash
yarn format && yarn lint && yarn test
```

Fix any issues. Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/content/ContentFieldEditor.jsx
git commit -m "feat(media): add GalleryItemsEditor with MediaPicker integration"
```

---

## Task 11: Rebuild MediaTab

**Files:**
- Modify: `src/components/admin/tabs/MediaTab.jsx`

- [ ] **Step 1: Replace MediaTab with full implementation**

Replace the entire contents of `src/components/admin/tabs/MediaTab.jsx`:

```jsx
import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Image, Upload, Copy, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import { SectionCard, SectionCardHeader, SectionCardTitle } from '../shared/SectionCard';
import ConfirmDialog from '../shared/ConfirmDialog';
import Button from 'components/ui/Button';
import { useMediaLibrary } from 'hooks/useMedia';
import {
  getUploadUrl,
  uploadToR2,
  triggerProcessing,
  deleteMedia,
  watchMediaDoc,
} from 'services/media';
import globalErrorHandler from 'utils/errorHandler';
import { toast } from 'utils/toast';

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const PRESET_OPTIONS = ['gallery', 'thumbnail', 'hero'];

// ─── Upload Zone ─────────────────────────────────────────────────────────────

const UploadZone = styled.div`
  border: 2px dashed ${(p) => (p.dragging ? p.theme.colors.primary : p.theme.colors.secondaryBorder)};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: ${(p) => p.dragging ? `${p.theme.colors.primary}0d` : 'transparent'};
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  user-select: none;
`;

const UploadZoneIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  color: ${(p) => p.theme.colors.textMuted};
`;

const UploadZoneText = styled.p`
  margin: 0 0 4px;
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
`;

const UploadZoneHint = styled.p`
  margin: 0 0 14px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
`;

const PresetSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  cursor: pointer;
`;

// ─── Active Uploads ───────────────────────────────────────────────────────────

const UploadList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const UploadItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

const UploadItemName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(p) => p.theme.colors.text};
`;

const ProgressBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border};
  width: 100px;
  flex-shrink: 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.primary};
  width: ${(p) => p.value}%;
  transition: width 0.1s linear;
`;

const UploadError = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.error};
  flex: 1;
`;

// ─── Media Grid ───────────────────────────────────────────────────────────────

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

const MediaCard = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const MediaThumb = styled.div`
  aspect-ratio: 4 / 3;
  background: ${(p) => p.theme.colors.background};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const MediaMeta = styled.div`
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const MediaFileName = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  color: ${(p) => p.theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MediaInfo = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s1};
  color: ${(p) => p.theme.colors.textMuted};
`;

const PresetBadge = styled.span`
  display: inline-block;
  padding: 1px 6px;
  border-radius: 4px;
  font-size: ${(p) => p.theme.typography.fontSizes.s0};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${(p) => p.theme.colors.primary}20;
  color: ${(p) => p.theme.colors.primary};
  width: fit-content;
`;

const MediaActions = styled.div`
  display: flex;
  gap: 4px;
  padding: 6px 10px;
  border-top: 1px solid ${(p) => p.theme.colors.border};
`;

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  border: 1px solid transparent;
  background: transparent;
  color: ${(p) => p.theme.colors.textMuted};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${(p) => p.theme.colors.surface};
    border-color: ${(p) => p.theme.colors.border};
    color: ${(p) => p.theme.colors.text};
  }

  &.destructive:hover {
    border-color: ${(p) => p.theme.colors.error}80;
    color: ${(p) => p.theme.colors.error};
    background: ${(p) => p.theme.colors.error}14;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  gap: 6px;
  color: ${(p) => p.theme.colors.textMuted};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString();
}

// ─── Active upload entry shape:
// { id, file, preset, state: 'uploading'|'processing'|'done'|'error', progress, error }

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaTab() {
  const [dragging, setDragging] = useState(false);
  const [preset, setPreset] = useState('gallery');
  const [activeUploads, setActiveUploads] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);
  const { items, refetch } = useMediaLibrary();

  const updateUpload = useCallback((id, patch) => {
    setActiveUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...patch } : u)),
    );
  }, []);

  const startUpload = useCallback(
    async (file, selectedPreset) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`Unsupported file type: ${file.type}`);
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`File too large (max 50 MB): ${file.name}`);
        return;
      }
      const id = `${Date.now()}-${file.name}`;
      setActiveUploads((prev) => [
        ...prev,
        { id, file, preset: selectedPreset, state: 'uploading', progress: 0, error: null },
      ]);

      try {
        const { uploadUrl, key, docId } = await getUploadUrl(file.name, selectedPreset, file.type);

        await uploadToR2(uploadUrl, file, (progress) => updateUpload(id, { progress }));
        updateUpload(id, { state: 'processing', progress: 100 });

        await triggerProcessing(key, docId);

        await new Promise((resolve, reject) => {
          const unsub = watchMediaDoc(docId, (mediaDoc) => {
            if (mediaDoc.status === 'ready') { unsub(); resolve(); }
            else if (mediaDoc.status === 'error') {
              unsub();
              reject(new Error(mediaDoc.errorMessage ?? 'Processing failed'));
            }
          });
        });

        updateUpload(id, { state: 'done' });
        refetch();
        setTimeout(() => setActiveUploads((prev) => prev.filter((u) => u.id !== id)), 2000);
      } catch (e) {
        updateUpload(id, { state: 'error', error: e.message });
        globalErrorHandler.reportError(e, { action: 'media-upload', file: file.name });
      }
    },
    [updateUpload, refetch],
  );

  const handleFiles = useCallback(
    (files) => {
      Array.from(files).forEach((file) => startUpload(file, preset));
    },
    [preset, startUpload],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteMedia(deleteTarget.id);
      toast.success('Image deleted');
      refetch();
    } catch (e) {
      toast.error('Delete failed — please try again');
      globalErrorHandler.reportError(e, { action: 'media-delete', docId: deleteTarget.id });
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget, refetch]);

  const copyUrl = useCallback((url) => {
    navigator.clipboard.writeText(url).then(() => toast.success('URL copied'));
  }, []);

  return (
    <motion.div key="media" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Media Library</PageTitle>
          <PageSubtitle>Upload and manage images</PageSubtitle>
        </div>
      </PageHeader>

      <SectionCard>
        <SectionCardHeader>
          <SectionCardTitle>
            <Upload size={12} />
            Upload Image
          </SectionCardTitle>
        </SectionCardHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <UploadZone
          dragging={dragging}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <UploadZoneIcon><Upload size={28} /></UploadZoneIcon>
          <UploadZoneText>Drag & drop or click to upload</UploadZoneText>
          <UploadZoneHint>JPG, PNG, WebP, AVIF, GIF · max 50 MB</UploadZoneHint>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.8rem' }}>Preset:</span>
            <PresetSelect
              value={preset}
              onChange={(e) => { e.stopPropagation(); setPreset(e.target.value); }}
              onClick={(e) => e.stopPropagation()}
            >
              {PRESET_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </PresetSelect>
          </div>
        </UploadZone>

        {activeUploads.length > 0 && (
          <UploadList>
            {activeUploads.map((u) => (
              <UploadItem key={u.id}>
                {u.state === 'done' ? (
                  <CheckCircle size={14} color="currentColor" style={{ color: 'var(--color-success, #22c55e)', flexShrink: 0 }} />
                ) : u.state === 'error' ? (
                  <AlertCircle size={14} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
                ) : (
                  <Upload size={14} style={{ flexShrink: 0 }} />
                )}
                <UploadItemName>{u.file.name}</UploadItemName>
                {u.state === 'uploading' && (
                  <ProgressBar>
                    <ProgressFill value={u.progress} />
                  </ProgressBar>
                )}
                {u.state === 'processing' && (
                  <span style={{ fontSize: '0.75rem', color: 'inherit' }}>Processing…</span>
                )}
                {u.state === 'error' && <UploadError>{u.error}</UploadError>}
              </UploadItem>
            ))}
          </UploadList>
        )}
      </SectionCard>

      <SectionCard style={{ marginTop: 12 }}>
        <SectionCardHeader>
          <SectionCardTitle>
            <Image size={12} />
            Library ({items.length})
          </SectionCardTitle>
        </SectionCardHeader>

        {items.length === 0 ? (
          <EmptyState>
            <Image size={28} />
            No images yet — upload one above
          </EmptyState>
        ) : (
          <MediaGrid>
            {items.map((item) => (
              <MediaCard key={item.id}>
                <MediaThumb>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.originalName} loading="lazy" />
                  )}
                </MediaThumb>
                <MediaMeta>
                  <MediaFileName>{item.originalName}</MediaFileName>
                  <PresetBadge>{item.preset}</PresetBadge>
                  {item.width && item.height && (
                    <MediaInfo>{item.width}×{item.height} · {formatBytes(item.sizeBytes)}</MediaInfo>
                  )}
                  <MediaInfo>{formatDate(item.createdAt)}</MediaInfo>
                </MediaMeta>
                <MediaActions>
                  <IconBtn title="Copy URL" onClick={() => copyUrl(item.imageUrl)}>
                    <Copy size={12} />
                  </IconBtn>
                  <IconBtn className="destructive" title="Delete" onClick={() => setDeleteTarget(item)}>
                    <Trash2 size={12} />
                  </IconBtn>
                </MediaActions>
              </MediaCard>
            ))}
          </MediaGrid>
        )}
      </SectionCard>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete image?"
        description={`"${deleteTarget?.originalName}" will be permanently removed from the library. Gallery items using this image will show a placeholder.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
```

> **Note:** `MediaTab` calls `services/media` functions directly rather than through `useUpload` so it can track per-file progress across multiple concurrent uploads independently. `useUpload` remains available for single-file upload consumers.

- [ ] **Step 2: Run format + lint**

```bash
yarn format && yarn lint
```

Fix any reported issues.

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/tabs/MediaTab.jsx
git commit -m "feat(media): rebuild MediaTab with upload zone and media library grid"
```

---

## Task 12: CSP updates in netlify.toml

**Files:**
- Modify: `netlify.toml`

- [ ] **Step 1: Update production CSP headers**

In `netlify.toml`, the production CSP is under `[context.production.headers.values]`. You need to add your R2 public domain to both `img-src` and `connect-src`. Replace `https://your-r2-public-domain.com` with the actual value of `R2_PUBLIC_URL`.

Find the `Content-Security-Policy` line under `[context.production.headers.values]` and update the `img-src` and `connect-src` directives:

- `img-src` — append your R2 public domain: `img-src 'self' data: blob: https://your-r2-public-domain.com;`
- `connect-src` — append your R2 public domain (for the presigned PUT) and the R2 endpoint: `connect-src 'self' ... https://your-r2-public-domain.com https://<account-id>.r2.cloudflarestorage.com;`

Example (with placeholder domain — replace with real values):

```toml
[context.production.headers.values]
  Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://your-r2-public-domain.com; font-src 'self' data:; connect-src 'self' https://sentry.io https://o*.ingest.sentry.io https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://storage.googleapis.com https://firebasestorage.googleapis.com https://your-r2-public-domain.com https://<account-id>.r2.cloudflarestorage.com;"
```

- [ ] **Step 2: Update deploy-preview and branch-deploy CSP headers**

Apply the same `img-src` and `connect-src` additions to `[context.deploy-preview.headers.values]` and `[context.branch-deploy.headers.values]`.

- [ ] **Step 3: Commit**

```bash
git add netlify.toml
git commit -m "chore(csp): allow R2 public domain in img-src and connect-src"
```

---

## Task 13: E2E tests

**Files:**
- Create: `tests/e2e/media.spec.js`

- [ ] **Step 1: Create Playwright E2E tests**

Create `tests/e2e/media.spec.js`:

```js
import { test, expect } from '@playwright/test';

// These tests require a running dev server with Firebase + R2 configured.
// Run: netlify dev (port 8888) or yarn dev (port 5173 without functions).

test.describe('Media Library', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes test admin credentials are set via PLAYWRIGHT_ADMIN_EMAIL + PLAYWRIGHT_ADMIN_PASSWORD
    // and that the admin UI is at /admin
    await page.goto('/admin');
    await page.fill('[data-testid="email-input"]', process.env.PLAYWRIGHT_ADMIN_EMAIL ?? 'admin@test.com');
    await page.fill('[data-testid="password-input"]', process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? 'password');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('**/admin**');
  });

  test('upload an image and see it appear in the library', async ({ page }) => {
    await page.click('[data-testid="media-tab"]');
    await page.waitForSelector('text=Media Library');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.alloc(1024, 0xff), // minimal fake JPEG
    });

    // Wait for upload + processing to complete (status: ready)
    await expect(page.locator('text=test-image.jpg').first()).toBeVisible({ timeout: 30000 });
  });

  test('delete an image from the library', async ({ page }) => {
    await page.click('[data-testid="media-tab"]');
    await page.waitForSelector('text=Media Library');

    // Assumes at least one image is already in the library
    const firstDeleteBtn = page.locator('[title="Delete"]').first();
    await firstDeleteBtn.click();

    // Confirm dialog
    await page.click('text=Delete');
    await expect(page.locator('text=Image deleted')).toBeVisible({ timeout: 5000 });
  });

  test('assign image to gallery item from content editor', async ({ page }) => {
    await page.click('[data-testid="content-tab"]');
    await page.click('text=Home');
    await page.click('text=Gallery');

    // Add a gallery item if none exist
    const addBtn = page.locator('text=＋ Add Gallery Item');
    if (await addBtn.isVisible()) await addBtn.click();

    await page.click('text=Pick image');
    // MediaPicker opens
    await page.waitForSelector('text=Select Image');
    await page.locator('.media-picker-grid button').first().click();

    // Verify imageUrl is set (image preview appears)
    await expect(page.locator('[aria-label="Gallery image"]').first()).toBeVisible();

    await page.click('text=Save');
    await expect(page.locator('text=Saved')).toBeVisible({ timeout: 5000 });
  });
});
```

- [ ] **Step 2: Run lint to confirm test file is clean**

```bash
yarn lint tests/e2e/media.spec.js
```

Fix any issues.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/media.spec.js
git commit -m "test(media): add Playwright E2E tests for media upload and gallery assignment"
```

---

## Final verification

- [ ] **Run all unit tests**

```bash
yarn test
```

Expected: all tests pass with no failures.

- [ ] **Run format + lint across all changed files**

```bash
yarn format && yarn lint
```

Fix any remaining issues.

- [ ] **Manual browser checklist**

1. Start dev server: `netlify dev` (requires R2 + Firebase env vars in `.env`)
2. Navigate to `/admin` → Media tab
3. Drag a >5MB JPEG onto the upload zone — confirm upload progress bar, then "Processing…" spinner, then image appears in grid
4. Upload a `.pdf` — confirm it is rejected client-side with an error toast
5. Click Copy URL on a library image — confirm URL in clipboard
6. Navigate to Content → Home → Gallery — add a gallery item, pick an image from the media library
7. Visit the home page — confirm the gallery renders the real image with lazy load
8. Delete the test image from the library — confirm it disappears from the grid
9. Check the gallery section — confirm the deleted image shows a placeholder, not a broken image
