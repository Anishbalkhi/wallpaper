import axiosInstance from './axiosInstance';

export const ratingApi = {
  // Get rating for a post
  getRating: (postId) => axiosInstance.get(`/ratings/post/${postId}`),
  
  // Add/update rating for a post
  ratePost: (postId, rating) => 
    axiosInstance.post(`/ratings/post/${postId}`, { rating }),
  
  // Get user's rating for a post
  getUserRating: (postId) => 
    axiosInstance.get(`/ratings/post/${postId}/user`),
};