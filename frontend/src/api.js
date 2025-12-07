
import axios from './services/axiosConfig';

// Import all API modules
import { authAPI } from './api/authApi';
import { procurementAPI } from './api/procurementApi';
import { adminAPI } from './api/adminApi';
import { searchAPI } from './api/searchApi';
import { bidAPI } from './api/bidApi';
import { companyProfileAPI } from './api/companyProfileApi';
import { directSupplyAPI } from './api/directSupplyApi';
import { notificationAPI } from './api/notificationApi';

// Export all APIs individually
export { 
  authAPI, 
  procurementAPI, 
  adminAPI, 
  searchAPI,
  bidAPI,
  companyProfileAPI,
  directSupplyAPI,
  notificationAPI
};

// Default export for backward compatibility
export default {
  auth: authAPI,
  procurement: procurementAPI,
  admin: adminAPI,
  search: searchAPI,
  bid: bidAPI,
  companyProfile: companyProfileAPI,
  directSupply: directSupplyAPI,
  notification: notificationAPI
};
