# Menu Images

This directory contains images for menu items.

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended size**: 400x300px (4:3 aspect ratio)
- **Max file size**: 200KB per image
- **Naming**: Use kebab-case matching the item name (e.g., `classic-burger.jpg`)

## Placeholder Image

A default `placeholder.svg` is provided as a fallback for items without images.

## Adding Images

1. Add your image file to this directory
2. Update the corresponding item in `src/data/menu.json` with the image path:
   ```json
   "image": "/images/menu/your-image.jpg"
   ```

## Using External Placeholder Services

During development, you can use placeholder image services:

- **Placeholder.com**: `https://via.placeholder.com/400x300/e0e0e0/666666?text=Menu+Item`
- **Picsum Photos**: `https://picsum.photos/400/300`
- **LoremFlickr**: `https://loremflickr.com/400/300/food`

## Optimizing Images

Before adding images to production:

1. Resize to recommended dimensions
2. Compress using tools like:
   - TinyPNG (https://tinypng.com)
   - Squoosh (https://squoosh.app)
   - ImageOptim (Mac)
3. Consider using WebP format for better compression
4. Add multiple sizes for responsive images if needed

## Future Enhancements

- Lazy loading for images below the fold
- Responsive images with `srcset`
- WebP with JPG fallback
- Image CDN integration
