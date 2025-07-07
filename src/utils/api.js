import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Submit a new vacation request
  submitRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  // Get all requests (for validators)
  getAllRequests: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/requests', { params });
    return response.data;
  },

  // Get requests for a specific user
  getUserRequests: async (userId) => {
    const response = await api.get(`/requests/user/${userId}`);
    return response.data;
  },

  // Update request status (approve/reject)
  updateRequestStatus: async (requestId, status, comments = null) => {
    const response = await api.put(`/requests/${requestId}/status`, {
      status,
      comments,
    });
    return response.data;
  },

  // Get all users
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

export default apiService; 