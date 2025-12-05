import axiosInstance from '../services/axiosConfig';

export const companyProfileAPI = {
  getSupplierProfile: (supplierId) => axiosInstance.get(`/company-profile/supplier/${supplierId}`),
  updateSupplierProfile: (supplierId, data) =>
    axiosInstance.put(`/company-profile/supplier/${supplierId}`, data),
  searchSuppliers: (filters) => axiosInstance.get('/company-profile/search', { params: filters }),
};
