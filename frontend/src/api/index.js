
/**
 * Unified API exports
 * All API calls should import from here
 */

// Import API modules from their actual locations
import axiosInstance from '../services/axiosConfig.js';
import { authAPI as authApiModule } from './authApi.js';
import * as procurementApi from './procurementApi.js';
import * as adminApi from './adminApi.js';
import * as searchApi from './searchApi.js';
import * as notificationApi from './notificationApi.js';

// Export organized API namespaces
export const authAPI = authApiModule;
export const procurementAPI = procurementApi;
export const adminAPI = adminApi;
export const searchAPI = searchApi;
export const notificationAPI = notificationApi;

// Export axios instance as apiClient
export const apiClient = axiosInstance;

// Export default axios instance
export default axiosInstance;
