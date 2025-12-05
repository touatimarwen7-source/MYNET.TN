import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetches notifications for the current user.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of notifications.
 */
export const getNotifications = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error.response?.data?.message || error.message);
    throw error;
  }
};
