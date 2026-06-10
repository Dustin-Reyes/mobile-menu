import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import {
  Image,
  Upload,
  Copy,
  Trash2,
  CheckCircle,
  AlertCircle,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import {
  SectionCard,
  SectionCardHeader,
  SectionCardTitle,
} from '../shared/SectionCard';
import ConfirmDialog from '../shared/ConfirmDialog';
import { useMediaLibrary } from 'hooks/useMedia';
import { MEDIA_CONFIG } from 'config/media';
import {
  getUploadUrl,
  uploadToR2,
  triggerProcessing,
  deleteMedia,
  renameMedia,
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
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
`;

// ─── Staged Preview ───────────────────────────────────────────────────────────

const StagedCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const StagedThumb = styled.div`
  width: 120px;
  height: 90px;
  flex-shrink: 0;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  overflow: hidden;
  background: ${(p) => p.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 160px;
  }
`;

const StagedInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NameInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FileMeta = styled.span`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
`;

const StagedActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
`;

const ActionBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  font-family: inherit;
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid;

  ${(p) =>
    p.primary
      ? `
    background: ${p.theme.colors.primary};
    border-color: ${p.theme.colors.primary};
    color: #fff;
    &:hover:not(:disabled) { opacity: 0.88; }
  `
      : `
    background: transparent;
    border-color: ${p.theme.colors.border};
    color: ${p.theme.colors.text};
    &:hover:not(:disabled) { background: ${p.theme.colors.background}; }
  `}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.border};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 2px;
  background: ${(p) => p.theme.colors.primary};
  width: ${(p) => p.value}%;
  transition: width 0.1s linear;
`;

const UploadStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: ${(p) => p.theme.colors.textMuted};
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
  display: flex;
  align-items: center;
  justify-content: center;

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

const RenameInput = styled.input`
  width: 100%;
  padding: 2px 5px;
  border: 1px solid ${(p) => p.theme.colors.primary};
  border-radius: ${(p) => p.theme.borderRadius.s1};
  background: ${(p) => p.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-family: inherit;
  font-weight: ${(p) => p.theme.typography.fontWeights.semibold};
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
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

const LibraryFullBanner = styled.div`
  padding: 20px;
  text-align: center;
  border: 2px dashed ${(p) => p.theme.colors.border};
  border-radius: ${(p) => p.theme.borderRadius.s2};
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function MediaTab() {
  const [dragging, setDragging] = useState(false);
  // staged: { file: File, name: string, previewUrl: string } | null
  const [staged, setStaged] = useState(null);
  // upload: { state: 'uploading'|'processing'|'done'|'error', progress: number, error: string|null } | null
  const [upload, setUpload] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  // renaming: { id: string, name: string } | null
  const [renaming, setRenaming] = useState(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const { items, refetch } = useMediaLibrary();

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const stageFile = useCallback((file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(`Unsupported file type: ${file.type}`);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File too large (max 50 MB): ${file.name}`);
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setStaged({ file, name: file.name, previewUrl });
    setUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const cancelStaged = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setStaged(null);
    setUpload(null);
  }, []);

  const processStaged = useCallback(async () => {
    if (!staged) return;
    setUpload({ state: 'uploading', progress: 0, error: null });

    try {
      const { uploadUrl, key, docId } = await getUploadUrl(
        staged.name,
        staged.file.type,
      );

      await uploadToR2(uploadUrl, staged.file, (progress) =>
        setUpload((prev) => ({ ...prev, progress })),
      );
      setUpload({ state: 'processing', progress: 100, error: null });

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

      setUpload({ state: 'done', progress: 100, error: null });
      toast.success(`${staged.name} uploaded`);
      refetch();
      setTimeout(() => {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
        setStaged(null);
        setUpload(null);
      }, 1500);
    } catch (e) {
      setUpload({ state: 'error', progress: 0, error: e.message });
      globalErrorHandler.reportError(e, {
        action: 'media-upload',
        file: staged.file.name,
      });
    }
  }, [staged, refetch]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) stageFile(file);
    },
    [stageFile],
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
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('URL copied'))
      .catch(() => toast.error('Failed to copy URL'));
  }, []);

  const commitRename = useCallback(async () => {
    if (!renaming?.name.trim()) return;
    try {
      await renameMedia(renaming.id, renaming.name.trim());
      setRenaming(null);
      refetch();
    } catch (e) {
      toast.error('Rename failed');
      globalErrorHandler.reportError(e, {
        action: 'media-rename',
        docId: renaming.id,
      });
    }
  }, [renaming, refetch]);

  const isProcessing =
    upload?.state === 'uploading' || upload?.state === 'processing';
  const libraryFull = items.length >= MEDIA_CONFIG.maxUploads;

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
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) stageFile(file);
          }}
        />

        {libraryFull && !staged ? (
          <LibraryFullBanner>
            Library full ({items.length}/{MEDIA_CONFIG.maxUploads}) — delete an
            image to upload more
          </LibraryFullBanner>
        ) : !staged ? (
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
            <UploadZoneHint>
              JPG, PNG, WebP, AVIF, GIF · max 50 MB
            </UploadZoneHint>
          </UploadZone>
        ) : (
          <StagedCard>
            <StagedThumb>
              <img src={staged.previewUrl} alt={staged.name} />
            </StagedThumb>

            <StagedInfo>
              <NameInput
                value={staged.name}
                disabled={isProcessing || upload?.state === 'done'}
                onChange={(e) =>
                  setStaged((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <FileMeta>
                {formatBytes(staged.file.size)} · {staged.file.type}
              </FileMeta>

              {!upload && (
                <StagedActions>
                  <ActionBtn onClick={cancelStaged}>Cancel</ActionBtn>
                  <ActionBtn primary onClick={processStaged}>
                    Process
                  </ActionBtn>
                </StagedActions>
              )}

              {upload?.state === 'uploading' && (
                <>
                  <ProgressBar>
                    <ProgressFill value={upload.progress} />
                  </ProgressBar>
                  <UploadStatus>Uploading… {upload.progress}%</UploadStatus>
                </>
              )}

              {upload?.state === 'processing' && (
                <UploadStatus>Processing…</UploadStatus>
              )}

              {upload?.state === 'done' && (
                <UploadStatus
                  style={{ color: 'var(--color-success, #22c55e)' }}
                >
                  <CheckCircle size={13} />
                  Done
                </UploadStatus>
              )}

              {upload?.state === 'error' && (
                <>
                  <UploadStatus style={{ color: 'var(--color-error)' }}>
                    <AlertCircle size={13} />
                    {upload.error}
                  </UploadStatus>
                  <StagedActions>
                    <ActionBtn onClick={cancelStaged}>Cancel</ActionBtn>
                    <ActionBtn primary onClick={processStaged}>
                      Retry
                    </ActionBtn>
                  </StagedActions>
                </>
              )}
            </StagedInfo>
          </StagedCard>
        )}
      </SectionCard>

      <SectionCard style={{ marginTop: 12 }}>
        <SectionCardHeader>
          <SectionCardTitle>
            <Image size={12} />
            Library ({items.length}/{MEDIA_CONFIG.maxUploads})
          </SectionCardTitle>
        </SectionCardHeader>

        {items.length === 0 ? (
          <EmptyState>
            <Image size={28} />
            No images yet — upload one above
          </EmptyState>
        ) : (
          <MediaGrid>
            {items.map((item) => {
              const displayUrl = item.urls?.gallery ?? item.imageUrl;
              return (
                <MediaCard key={item.id}>
                  <MediaThumb>
                    {displayUrl && (
                      <img
                        src={displayUrl}
                        alt={item.originalName}
                        loading="lazy"
                      />
                    )}
                  </MediaThumb>
                  <MediaMeta>
                    {renaming?.id === item.id ? (
                      <RenameInput
                        value={renaming.name}
                        autoFocus
                        onChange={(e) =>
                          setRenaming((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename();
                          if (e.key === 'Escape') setRenaming(null);
                        }}
                      />
                    ) : (
                      <MediaFileName>{item.originalName}</MediaFileName>
                    )}
                    <MediaInfo>{formatDate(item.createdAt)}</MediaInfo>
                  </MediaMeta>
                  <MediaActions>
                    {renaming?.id === item.id ? (
                      <>
                        <IconBtn title="Save" onClick={commitRename}>
                          <Check size={12} />
                        </IconBtn>
                        <IconBtn
                          title="Cancel"
                          onClick={() => setRenaming(null)}
                        >
                          <X size={12} />
                        </IconBtn>
                      </>
                    ) : (
                      <>
                        {displayUrl && (
                          <IconBtn
                            title="Copy URL"
                            onClick={() => copyUrl(displayUrl)}
                          >
                            <Copy size={12} />
                          </IconBtn>
                        )}
                        <IconBtn
                          title="Rename"
                          onClick={() =>
                            setRenaming({
                              id: item.id,
                              name: item.originalName,
                            })
                          }
                        >
                          <Pencil size={12} />
                        </IconBtn>
                        <IconBtn
                          className="destructive"
                          title="Delete"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 size={12} />
                        </IconBtn>
                      </>
                    )}
                  </MediaActions>
                </MediaCard>
              );
            })}
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
