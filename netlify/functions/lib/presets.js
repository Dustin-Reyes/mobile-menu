/**
 * Image processing preset definitions.
 *
 * Each preset specifies the target dimensions, quality, and resize fit mode
 * used by the process-image-background Netlify function.
 */

export const PRESETS = {
  gallery:   { width: 1200, height: 900,  quality: 80, fit: 'cover' },
  thumbnail: { width: 400,  height: 300,  quality: 75, fit: 'cover' },
  hero:      { width: 2400, height: 1350, quality: 85, fit: 'cover' },
};

export const VALID_PRESETS = Object.keys(PRESETS);
