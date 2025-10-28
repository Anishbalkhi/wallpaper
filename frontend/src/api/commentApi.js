import axiosInstance from './axiosInstance';

export const commentApi = {
  // Get comments for a post
  getComments: (postId) => axiosInstance.get(`/comments/post/${postId}`),
  
  // Add comment to a post
  addComment: (postId, commentData) => 
    axiosInstance.post(`/comments/post/${postId}`, commentData),
  
  // Update comment
  updateComment: (commentId, commentData) => 
    axiosInstance.put(`/comments/${commentId}`, commentData),
  
  // Delete comment
  deleteComment: (commentId) => 
    axiosInstance.delete(`/comments/${commentId}`),
  
  // Like/Unlike comment
  likeComment: (commentId) => 
    axiosInstance.post(`/comments/${commentId}/like`),
};