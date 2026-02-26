// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Do NOT add Authorization header from localStorage here.
// Backend validates cookie. If you later support Bearer tokens, do it explicitly.

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // BUG 1 FIX: Dispatch a custom event instead of hard redirect.
    // AuthProvider listens to this and uses React Router's navigate() for a
    // graceful redirect — no full-page reload.
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
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
  // BUG 3 FIX: Update own profile (name, bio)
  updateMyProfile: (data) => api.put("/users/me", data),
};

export const postAPI = {
 createPost: (formData) =>
  api.post("/post/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),

  getPosts: (params) => api.get("/post/posts", { params }),
  deletePost: (postId) => api.delete(`/post/delete/${postId}`),
  purchasePost: (postId) => api.post(`/post/${postId}/purchase`),
  downloadPost: (id) => api.get(`/post/${id}/download`),
addComment: (id, text) =>
  api.post(`/post/${id}/comment`, { text }),

  likePost: (id) => api.post(`/post/${id}/like`),

  uploadProfilePic: (formData) => api.post("/users/upload-profile-pic", formData),
};

export default api;
