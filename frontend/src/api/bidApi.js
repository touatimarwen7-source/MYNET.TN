import axiosInstance from '../services/axiosConfig';

/**
 * Submits a new bid for a tender.
 * This function should handle the encryption of sensitive data before sending.
 * @param {FormData} bidData - The bid data, likely as FormData to support file uploads.
 * @returns {Promise<Object>} A promise that resolves to the submission confirmation.
 */
const submitBid = async (bidData) => {
  // In a real implementation, client-side encryption of financial data would happen here
  // before appending to formData.
  try {
    const response = await axiosInstance.post('/procurement/bids/submit', bidData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting bid:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const bidAPI = {
  submitBid,
};
