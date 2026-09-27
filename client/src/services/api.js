import axios from 'axios';
import { AUTH_SYNC_EVENT } from '../constants/auth';

const api = axios.create({
  baseURL: '/api'
});

// Request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivityTimestamp');
    // Dispatch custom event so AuthContext can sync its state
    window.dispatchEvent(new Event(AUTH_SYNC_EVENT));
  }
  return Promise.reject(error);
});

export default api;
