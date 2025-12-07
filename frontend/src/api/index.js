
/**
 * Unified API exports
 * All API calls should import from here
 */

// Re-export from main api.js
export { 
  authAPI,
  procurementAPI,
  adminAPI,
  searchAPI,
  notificationAPI,
  apiClient
} from '../api.js';

// Export default axios instance
export { default } from '../api.js';
