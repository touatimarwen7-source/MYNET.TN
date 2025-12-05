import axiosInstance from '../services/axiosConfig';

export const searchAPI = {
  searchTenders: (params) => axiosInstance.get('/search/tenders', { params }),
  searchSuppliers: (params) => axiosInstance.get('/search/suppliers', { params }),
};
