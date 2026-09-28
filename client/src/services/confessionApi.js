import api from './api';

// Get all confessions (paginated)
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
export const createConfession = async (content) => {
  const response = await api.post('/confessions', { content });
  return response.data.data;
};

// Get current user's confessions
export const getMyConfessions = async () => {
  const response = await api.get('/confessions/my');
  // response.data = { success, data: [confessions] }
  return response.data.data;
};

// Like a confession (toggle)
export const likeConfession = async (id) => {
  const response = await api.put(`/confessions/${id}/like`);
  return response.data.data;
};

// Dislike a confession (toggle)
export const dislikeConfession = async (id) => {
  const response = await api.put(`/confessions/${id}/dislike`);
  return response.data.data;
};

// Delete a confession by ID
export const deleteConfession = async (id) => {
  const response = await api.delete(`/confessions/${id}`);
  return response.data;
};
