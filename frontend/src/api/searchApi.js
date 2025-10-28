import axiosInstance from './axiosInstance';

export const searchApi = {
  // Advanced search
  searchPosts: (params) => axiosInstance.get('/search/posts', { params }),
  
  // Search by category
  searchByCategory: (category) => 
    axiosInstance.get(`/search/category/${category}`),
  
  // Search by tags
  searchByTags: (tags) => 
    axiosInstance.get('/search/tags', { params: { tags } }),
  
  // Get popular posts
  getPopularPosts: () => axiosInstance.get('/search/popular'),
};