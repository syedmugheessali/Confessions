import api from './api';

// Login user — returns { user, token }
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // response.data = { success, data: { user, token } }
  return response.data.data;
};

// Register user — returns { user, token }
export const register = async (name, email, password, confirmPassword) => {
  const response = await api.post('/auth/register', { name, email, password, confirmPassword });
  return response.data.data;
};

// Get current user — returns { user }
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};
