import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import {
  Image,
  Upload,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from '../shared/SectionCard';
import ConfirmDialog from '../shared/ConfirmDialog';
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

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
];
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const PRESET_OPTIONS = ['gallery', 'thumbnail', 'hero'];

// ─── Upload Zone ─────────────────────────────────────────────────────────────

const UploadZone = styled.div`
  border: 2px dashed
    ${(p) =>
      p.dragging ? p.theme.colors.primary : p.theme.colors.secondaryBorder};
  border-radius: ${(p) => p.theme.borderRadius.s2};
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;
  background: ${(p) =>
    p.dragging ? `${p.theme.colors.primary}0d` : 'transparent'};
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
        {
          id,
          file,
          preset: selectedPreset,
          state: 'uploading',
          progress: 0,
          error: null,
        },
      ]);

      try {
        const { uploadUrl, key, docId } = await getUploadUrl(
          file.name,
          selectedPreset,
          file.type,
        );

        await uploadToR2(uploadUrl, file, (progress) =>
          updateUpload(id, { progress }),
        );
        updateUpload(id, { state: 'processing', progress: 100 });

        await triggerProcessing(key, docId);

        await new Promise((resolve, reject) => {
          const unsub = watchMediaDoc(docId, (mediaDoc) => {
            if (mediaDoc.status === 'ready') {
              unsub();
              resolve();
            } else if (mediaDoc.status === 'error') {
              unsub();
              reject(new Error(mediaDoc.errorMessage ?? 'Processing failed'));
            }
          });
        });

        updateUpload(id, { state: 'done' });
        refetch();
        setTimeout(
          () => setActiveUploads((prev) => prev.filter((u) => u.id !== id)),
          2000,
        );
      } catch (e) {
        updateUpload(id, { state: 'error', error: e.message });
        globalErrorHandler.reportError(e, {
          action: 'media-upload',
          file: file.name,
        });
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
      globalErrorHandler.reportError(e, {
        action: 'media-delete',
        docId: deleteTarget.id,
      });
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
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <UploadZoneIcon>
            <Upload size={28} />
          </UploadZoneIcon>
          <UploadZoneText>Drag & drop or click to upload</UploadZoneText>
          <UploadZoneHint>JPG, PNG, WebP, AVIF, GIF · max 50 MB</UploadZoneHint>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: '0.8rem' }}>Preset:</span>
            <PresetSelect
              value={preset}
              onChange={(e) => {
                e.stopPropagation();
                setPreset(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {PRESET_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </PresetSelect>
          </div>
        </UploadZone>

        {activeUploads.length > 0 && (
          <UploadList>
            {activeUploads.map((u) => (
              <UploadItem key={u.id}>
                {u.state === 'done' ? (
                  <CheckCircle
                    size={14}
                    color="currentColor"
                    style={{
                      color: 'var(--color-success, #22c55e)',
                      flexShrink: 0,
                    }}
                  />
                ) : u.state === 'error' ? (
                  <AlertCircle
                    size={14}
                    style={{ color: 'var(--color-error)', flexShrink: 0 }}
                  />
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
                  <span style={{ fontSize: '0.75rem', color: 'inherit' }}>
                    Processing…
                  </span>
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
                    <img
                      src={item.imageUrl}
                      alt={item.originalName}
                      loading="lazy"
                    />
                  )}
                </MediaThumb>
                <MediaMeta>
                  <MediaFileName>{item.originalName}</MediaFileName>
                  <PresetBadge>{item.preset}</PresetBadge>
                  {item.width && item.height && (
                    <MediaInfo>
                      {item.width}×{item.height} · {formatBytes(item.sizeBytes)}
                    </MediaInfo>
                  )}
                  <MediaInfo>{formatDate(item.createdAt)}</MediaInfo>
                </MediaMeta>
                <MediaActions>
                  <IconBtn
                    title="Copy URL"
                    onClick={() => copyUrl(item.imageUrl)}
                  >
                    <Copy size={12} />
                  </IconBtn>
                  <IconBtn
                    className="destructive"
                    title="Delete"
                    onClick={() => setDeleteTarget(item)}
                  >
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
