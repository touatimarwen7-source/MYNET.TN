import axiosInstance from './axiosConfig';

// Simple compatibility wrapper: export axios instance as default
export default axiosInstance;

// Also export helper that matches previous API shape if needed
export const get = (url, opts) => axiosInstance.get(url, opts);
export const post = (url, data, opts) => axiosInstance.post(url, data, opts);
export const put = (url, data, opts) => axiosInstance.put(url, data, opts);
export const del = (url, opts) => axiosInstance.delete(url, opts);
