import api from './api';

// Get system stats (Admin & Moderator)
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data.data;
};

// Get list of users (Admin only)
export const getAdminUsers = async (page = 1, limit = 20, search = '', role = '') => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.append('search', search);
  if (role) params.append('role', role);

  const response = await api.get(`/admin/users?${params.toString()}`);
  return response.data.data;
};

// Update a user's role (Admin only)
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};

// Get all confessions for moderation (Admin & Moderator)
export const getAdminConfessions = async (page = 1, limit = 20, status = '') => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);

  const response = await api.get(`/admin/confessions?${params.toString()}`);
  return response.data.data;
};

// Moderator/Admin delete confession
export const adminDeleteConfession = async (id) => {
  const response = await api.delete(`/admin/confessions/${id}`);
  return response.data;
};
