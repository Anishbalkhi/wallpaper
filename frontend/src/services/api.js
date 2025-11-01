import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/users/me'),
};

export const userAPI = {
  getUsers: () => api.get('/users/admin/users'),
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role }),
  updateUserStatus: (userId, status) => api.put(`/users/${userId}/status`, status),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUserStats: () => api.get('/users/admin/stats'),
};

export const postAPI = {
  createPost: (formData) => api.post('/post/create', formData),
  getPosts: (params) => api.get('/post/posts', { params }),
  deletePost: (postId) => api.delete(`/post/delete/${postId}`),
  purchasePost: (postId) => api.post(`/post/${postId}/purchase`),
  downloadPost: (postId) => api.get(`/post/${postId}/download`),
};

export default api;