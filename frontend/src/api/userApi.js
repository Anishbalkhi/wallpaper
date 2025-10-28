import axiosInstance from './axiosInstance';

export const userApi = {
  // Get current user profile
  getProfile: () => axiosInstance.get('/users/me'),
  
  // Update user profile
  updateProfile: (userData) => axiosInstance.put('/users/profile', userData),
  
  // Admin: Get all users
  getUsers: () => axiosInstance.get('/users/admin'),
  
  // Admin: Delete user
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};