import axiosInstance from './axiosInstance';

export const favoriteApi = {
  // Get user's favorites
  getFavorites: () => axiosInstance.get('/favorites'),
  
  // Add to favorites
  addFavorite: (postId) => 
    axiosInstance.post('/favorites', { postId }),
  
  // Remove from favorites
  removeFavorite: (postId) => 
    axiosInstance.delete(`/favorites/${postId}`),
  
  // Check if post is favorited
  checkFavorite: (postId) => 
    axiosInstance.get(`/favorites/check/${postId}`),
};