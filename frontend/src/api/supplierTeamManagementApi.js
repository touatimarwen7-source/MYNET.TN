
import api from './axiosConfig';

export const supplierTeamManagementApi = {
  // Get all team members
  getTeamMembers: async () => {
    const response = await api.get('/api/supplier-team-management');
    return response.data;
  },

  // Get team statistics
  getTeamStats: async () => {
    const response = await api.get('/api/supplier-team-management/stats');
    return response.data;
  },

  // Add new team member
  addTeamMember: async (memberData) => {
    const response = await api.post('/api/supplier-team-management', memberData);
    return response.data;
  },

  // Update team member
  updateTeamMember: async (memberId, updates) => {
    const response = await api.put(`/api/supplier-team-management/${memberId}`, updates);
    return response.data;
  },

  // Remove team member
  removeTeamMember: async (memberId) => {
    const response = await api.delete(`/api/supplier-team-management/${memberId}`);
    return response.data;
  },
};

export default supplierTeamManagementApi;
