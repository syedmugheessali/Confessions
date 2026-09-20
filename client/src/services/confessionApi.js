import api from './api';

// Get all active confessions (paginated)
export const getConfessions = async (page = 1, limit = 20) => {
  const response = await api.get(`/confessions?page=${page}&limit=${limit}`);
  // response.data = { success, data: { confessions, pagination } }
  return response.data.data;
};

// Get a single confession by ID
export const getConfession = async (id) => {
  const response = await api.get(`/confessions/${id}`);
  // response.data = { success, data: confession }
  return response.data.data;
};

// Create a new confession
export const createConfession = async (content, duration) => {
  const response = await api.post('/confessions', { content, duration });
  return response.data.data;
};

// Get current user's confessions
export const getMyConfessions = async () => {
  const response = await api.get('/confessions/my');
  // response.data = { success, data: [confessions] }
  return response.data.data;
};

// Delete a confession by ID
export const deleteConfession = async (id) => {
  const response = await api.delete(`/confessions/${id}`);
  return response.data;
};
