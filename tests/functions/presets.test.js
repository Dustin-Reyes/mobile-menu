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
