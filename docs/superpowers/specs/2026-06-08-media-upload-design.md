# Media Upload & Gallery Management — Design Spec

**Issue:** #37  
**Date:** 2026-06-08  
**Status:** Approved

---

## Overview

Enable admins to upload, process, and manage images through the CMS Media tab, and assign them to gallery items on the site. Images are uploaded directly to Cloudflare R2 via presigned URLs, processed asynchronously by a Netlify background function using Sharp, and tracked in Firestore. Gallery items are managed as part of the existing `pages/home` CMS content.

---

## Architecture & Data Flow

```
1. Browser → POST /.netlify/functions/get-upload-url
            { filename, preset, mimeType }
            ← { uploadUrl, key, docId }
            Firestore doc created: { status: "pending", preset, ... }

2. Browser → PUT directly to R2 (presigned URL, Netlify not in path)
            raw file → R2 at raw/<docId>.<ext>

3. Browser → POST /.netlify/functions/process-image-background
            { key, docId }
            ← 202 immediately

            [async] Sharp: resize/crop/WebP/strip EXIF per preset
                    writes processed → R2 at media/<docId>.webp
                    deletes raw/<docId>.<ext>
                    Firestore: { status: "ready", imageUrl, width, height, sizeBytes, processedAt }

4. Browser ← Firestore onSnapshot watches doc → UI updates on "ready"

5. Browser → POST /.netlify/functions/delete-media
            { docId } ← removes from R2 + Firestore
```

---

## Image Processing Presets

Defined in `netlify/functions/lib/presets.js`, shared across all functions:

| Preset      | Width | Height | Quality | Fit   | Target size |
|-------------|-------|--------|---------|-------|-------------|
| `gallery`   | 1200  | 900    | 80      | cover | ~200 KB     |
| `thumbnail` | 400   | 300    | 75      | cover | ~50 KB      |
| `hero`      | 2400  | 1350   | 85      | cover | ~500 KB     |

All output in WebP. EXIF stripped. Center-crop via `fit: cover`.

---

## Netlify Functions

### `get-upload-url.js` (sync)

- Verifies Firebase Bearer token; checks `canEditContent(role)` via custom claims
- Validates `filename`, `preset` (must be `gallery` | `thumbnail` | `hero`), `mimeType` (jpg/png/webp/avif/gif only)
- Generates presigned R2 `PUT` URL via `@aws-sdk/client-s3` + `getSignedUrl` (5-min expiry)
- Creates Firestore `media` doc: `{ status: "pending", preset, originalName, mimeType, uploadedBy, createdAt }`
- Returns `{ uploadUrl, key, docId }`

### `process-image-background.js` (background — 202, up to 15 min)

- Verifies Bearer token + role
- Receives `{ key, docId }`
- Downloads raw from R2 into a Buffer
- Looks up preset config from `lib/presets.js`
- Sharp: resize to fit (cover crop), convert to WebP, strip EXIF, set quality
- Uploads processed file to R2 at `media/<docId>.webp`
- Deletes raw file from R2
- Updates Firestore: `{ status: "ready", imageUrl, width, height, sizeBytes, processedAt }`
- On any error: sets `{ status: "error", errorMessage }` so UI can surface it

### `delete-media.js` (sync)

- Verifies Bearer token + role
- Receives `{ docId }`
- Reads Firestore doc to get the R2 key
- Deletes `media/<docId>.webp` from R2 (treats 404 as success — idempotent)
- Deletes Firestore doc
- Does NOT cascade to gallery items (`imageUrl` fields go dangling; Gallery.jsx falls back to placeholder silently)

### `netlify/functions/lib/presets.js` (shared)

Named preset config consumed by `process-image-background.js` and `get-upload-url.js` for validation.

---

## Auth

All three functions use the same pattern as `translate.js`:
- Require `Authorization: Bearer <Firebase ID token>`
- Verify token via Firebase Admin SDK
- Check `canEditContent(role)` — all three roles (`content_manager`, `site_manager`, `admin`) are permitted
- Return 401 if no token, 403 if insufficient role

---

## Environment Variables

| Variable | Used by |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | All three functions |
| `R2_ACCESS_KEY_ID` | All three functions |
| `R2_SECRET_ACCESS_KEY` | All three functions |
| `R2_BUCKET_NAME` | All three functions |
| `R2_PUBLIC_URL` | `process-image-background.js` (constructs `imageUrl`) |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | All three functions (already set) |

---

## Frontend Service Layer

### `src/services/media.js`

Thin service wrapping the three Netlify functions and Firestore. Methods:

- `getUploadUrl(filename, preset, mimeType)` — POST to `get-upload-url`
- `uploadToR2(uploadUrl, file, onProgress)` — direct `XMLHttpRequest` PUT to presigned URL (XHR used for upload progress; fetch doesn't expose it)
- `triggerProcessing(key, docId)` — POST to `process-image-background`
- `deleteMedia(docId)` — POST to `delete-media`
- `getMediaLibrary()` — queries Firestore `media` collection ordered by `createdAt desc`; filters and cleans up `pending` docs older than 1 hour on fetch
- `watchMediaDoc(docId, callback)` — `onSnapshot` listener, returns unsubscribe fn

### `src/hooks/useMedia.js`

- `useMediaLibrary()` — fetches and subscribes to `media` collection. Returns `{ items, loading, error, refetch }`
- `useUpload()` — orchestrates the full upload flow. Returns `{ upload(file, preset), uploading, progress, error }`. Internally: getUploadUrl → PUT to R2 with progress → triggerProcessing → onSnapshot until `status: "ready"` or `status: "error"`

---

## Frontend Components

### `src/components/admin/tabs/MediaTab.jsx` (replaces placeholder)

- Upload zone: drag-and-drop + click-to-select; accepts jpg/png/webp/avif/gif; max 50MB client-side; preset selector defaulting to `gallery`
- Active uploads list: per-file progress bar (uploading phase) + processing spinner (processing phase)
- Media library grid: thumbnail, filename, preset badge, dimensions, file size, upload date
- Per-card actions: Copy URL, Delete (with confirm dialog reusing existing `ConfirmDialog`)

### `src/components/admin/media/MediaPicker.jsx` (new)

- Modal dialog for selecting an image from the library
- Triggered from the gallery item editor
- Shows library grid filtered to `status: "ready"` only
- Selecting an image sets `imageUrl` on the gallery item and closes

### Content schema & editor additions

**`src/content/schema.js`** — add to `home.fields`:
```js
{ key: 'galleryItems', label: 'Gallery Items', type: 'gallery-items', group: 'Gallery' }
```

**`src/components/admin/content/ContentFieldEditor.jsx`** — add `gallery-items` type:
- Array editor matching the pattern of `faq-items` / `service-items`
- Each item: Title (text), Description (textarea), Image (MediaPicker button), order drag-handle
- Add / remove / reorder items

**`src/content/pages.js`** — add `items: []` to `home.en.gallery`

### `src/components/sections/Gallery.jsx` (update)

- Replace `GalleryImage` styled div with `<img src={item.imageUrl} alt={item.title} loading="lazy" />` when `item.imageUrl` is present
- Fall back to current placeholder div when no `imageUrl`

---

## Error Handling

| Failure | Handling |
|---|---|
| File too large / wrong type | Rejected client-side before any network call; shown inline in upload zone |
| `get-upload-url` fails | Upload aborted, error shown on file card, no Firestore doc created |
| PUT to R2 fails | `triggerProcessing` never called; doc stays `pending`; cleaned up on next `getMediaLibrary()` call (>1 hour old) |
| Background function crashes | Sets `status: "error"` on Firestore doc; UI shows "Processing failed" with retry button |
| R2 delete succeeds, Firestore delete fails | Logged to Sentry via `globalErrorHandler`; surfaced as toast; retry cleans up Firestore only |
| R2 object 404 on delete | Treated as success (idempotent) |

---

## CSP Updates (`netlify.toml`)

Production CSP headers updated:
- `img-src` — add R2 public domain
- `connect-src` — add R2 public domain (for presigned PUT from browser)

---

## Testing

### Unit tests (Jest)

- `src/services/media.js` — mock ApiClient and Firestore; test return shapes and error paths for each method
- `src/hooks/useMedia.js` — `useUpload` state machine: pending → uploading → processing → ready/error transitions
- `netlify/functions/lib/presets.js` — preset values within expected ranges

### Integration tests (Jest + mocked Firestore)

- `get-upload-url` — valid auth + valid payload returns presigned URL and creates Firestore doc; invalid role returns 403; bad mime type returns 400
- `delete-media` — deletes R2 object and Firestore doc; missing `docId` returns 400

### E2E tests (Playwright — happy path)

- Upload image in Media tab → wait for `status: "ready"` → appears in library grid
- Delete image → disappears from grid
- Open gallery item editor → open MediaPicker → select image → save → `imageUrl` persisted

### Manual testing checklist

- Upload a large image (>10MB) and confirm R2 landing and correct processing
- Upload an invalid file type and confirm client-side rejection
- Confirm Gallery section renders real images on the public site after assignment
- Confirm Gallery section shows placeholder gracefully when no image assigned

---

## Files Created / Modified

### New files
- `netlify/functions/get-upload-url.js`
- `netlify/functions/process-image-background.js`
- `netlify/functions/delete-media.js`
- `netlify/functions/lib/presets.js`
- `src/services/media.js`
- `src/hooks/useMedia.js`
- `src/components/admin/media/MediaPicker.jsx`

### Modified files
- `netlify/functions/lib/` (new shared lib directory)
- `netlify.toml` — CSP headers
- `src/components/admin/tabs/MediaTab.jsx` — full replacement
- `src/components/admin/content/ContentFieldEditor.jsx` — add `gallery-items` type
- `src/content/schema.js` — add `galleryItems` field
- `src/content/pages.js` — add `items: []` to gallery
- `src/components/sections/Gallery.jsx` — render real images

### New dependencies
- `sharp` (background function — image processing)
- `@aws-sdk/client-s3` (all functions — R2 S3-compatible API)
- `@aws-sdk/s3-request-presigner` (get-upload-url — presigned URLs)
- `firebase-admin` (all functions — already used by translate.js)
