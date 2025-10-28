import axiosInstance from './axiosInstance';

export const postApi = {
  // Get all posts with optional filters
  getPosts: (params = {}) => axiosInstance.get('/post/posts', { params }),
  
  // Get single post by ID
  getPost: (id) => axiosInstance.get(`/post/posts/${id}`),
  
  // Create new post with image upload
  createPost: (formData) => axiosInstance.post('/post/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Update post
  updatePost: (id, formData) => axiosInstance.put(`/post/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete post
  deletePost: (id) => axiosInstance.delete(`/post/delete/${id}`),
  
  // Purchase a post
  purchasePost: (id) => axiosInstance.post(`/post/${id}/purchase`),
  
  // Download a post
  downloadPost: (id) => axiosInstance.get(`/post/${id}/download`, {
    responseType: 'blob'
  }),
  
  // Upload profile picture
  uploadProfilePic: (formData) => axiosInstance.post('/post/createPost', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Get user's posts
  getMyPosts: () => axiosInstance.get('/post/my-posts'),

  
};