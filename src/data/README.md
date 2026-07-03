# Menu Data Schema

This directory contains the menu data for the mobile menu application.

## File Structure

- `menu.json` - Main menu data file containing categories and items

## Schema Documentation

### Categories

Each category has the following structure:

```json
{
  "id": "string",           // Unique identifier (kebab-case)
  "name": "string",         // Display name
  "description": "string",  // Category description
  "order": number           // Sort order (1-based)
}
```

### Menu Items

Each menu item has the following structure:

```json
{
  "id": "string",           // Unique identifier (category-number format)
  "name": "string",         // Item name
  "description": "string",  // Short description (1-2 sentences)
  "price": number,          // Price in USD (decimal)
  "category": "string",     // Category ID (must match a category.id)
  "image": "string",        // Image path (relative to public/)
  "tags": ["string"],       // Array of tags (popular, vegan, spicy, etc.)
  "available": boolean,     // Whether item is currently available
  "allergens": ["string"]   // Array of allergen warnings
}
```

## Available Tags

- `popular` - Popular/featured items
- `vegan` - Vegan-friendly
- `vegetarian` - Vegetarian-friendly
- `spicy` - Spicy items
- `healthy` - Health-conscious options

## Common Allergens

- `gluten`
- `dairy`
- `eggs`
- `soy`
- `seafood`
- `nuts`
- `shellfish`

## Adding New Items

1. Add the item to the `items` array in `menu.json`
2. Ensure the `category` field matches an existing category ID
3. Add an image to `/public/images/menu/` and reference it in the `image` field
4. Use appropriate tags and allergen warnings
5. Set `available: true` for active items

## Adding New Categories

1. Add the category to the `categories` array in `menu.json`
2. Set a unique `id` (kebab-case)
3. Set the `order` to control display sequence
4. Add items with matching `category` field

## Example Usage

```javascript
import menuData from './data/menu.json';

// Get all categories
const categories = menuData.categories;

// Get all items
const items = menuData.items;

// Get items by category
const drinks = items.filter(item => item.category === 'drinks');

// Get available items only
const availableItems = items.filter(item => item.available);

// Get items by tag
const popularItems = items.filter(item => item.tags.includes('popular'));
```
