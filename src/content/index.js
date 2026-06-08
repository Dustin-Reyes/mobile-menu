/**
 * Centralised exports for all local content fallbacks.
 *
 * Re-exports `pages`, `settings`, and `navigation` from their respective
 * modules so consumers can import from a single entry point. Also re-exports
 * `pageSchema` from the schema module.
 *
 * @module content
 */

import { pages } from './pages';
import { settings } from './settings';
import { navigation } from './navigation';

export { pages, settings, navigation };
export { pageSchema } from './schema';

// Default export for easy importing
export default {
  pages,
  settings,
  navigation,
};
