/**
 * Content exports
 *
 * Centralized exports for all local content fallbacks.
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
