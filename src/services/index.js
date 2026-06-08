/**
 * Services entry point.
 *
 * Exports a pre-configured singleton `ApiClient` instance as the default
 * export for use throughout the application, and re-exports the `ApiClient`
 * class for consumers that need to create their own instances.
 *
 * @module services
 */
import ApiClient from './ApiClient';

const apiClient = new ApiClient();

export { ApiClient };
export default apiClient;
