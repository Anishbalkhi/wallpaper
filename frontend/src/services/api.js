// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // <--- cookies (httpOnly) will be sent automatically
});

// Do NOT add Authorization header from localStorage here.
// Backend validates cookie. If you later support Bearer tokens, do it explicitly.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // central 401 handling: if backend returns 401, redirect to login
    if (error.response?.status === 401) {
      // Optionally: you could use an event emitter or store
      // For simplicity, redirect to login page:
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (userData) => api.post("/auth/signup", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/users/me"),
};

export const userAPI = {
  getUsers: () => api.get("/users/admin/users"),
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role }),
  updateUserStatus: (userId, statusObj) => api.put(`/users/${userId}/status`, statusObj),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUserStats: () => api.get("/users/admin/stats"),
};

export const postAPI = {
  createPost: (formData) => api.post("/post/create", formData),
  getPosts: (params) => api.get("/post/posts", { params }),
  deletePost: (postId) => api.delete(`/post/delete/${postId}`),
  purchasePost: (postId) => api.post(`/post/${postId}/purchase`),
  downloadPost: (postId) => api.get(`/post/${postId}/download`),
  uploadProfilePic: (formData) => api.post("/users/upload-profile-pic", formData),
};

export default api;
