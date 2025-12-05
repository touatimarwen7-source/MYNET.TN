import axiosInstance from '../services/axiosConfig';

export const directSupplyAPI = {
  getSuppliers: () => axiosInstance.get('/direct-supply/suppliers'),
  createRequest: (data) => axiosInstance.post('/direct-supply/create-request', data),
  getMyRequests: () => axiosInstance.get('/direct-supply/my-requests'),
  getReceivedRequests: () => axiosInstance.get('/direct-supply/received-requests'),
  updateRequestStatus: (requestId, status) =>
    axiosInstance.put(`/direct-supply/${requestId}/status`, { status }),
};
