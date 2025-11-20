import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';

const PostsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postAPI.getPosts({
        category: selectedCategory || undefined,
        limit: 20,
        page: 1
      });
      
      if (response.data.success) {
        setPosts(response.data.posts || []);
      } else {
        setError('Failed to load posts');
      }
    } catch (err) {
      setError('Error fetching posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      // This would typically come from your backend
      // For now, we'll extract from existing posts or use defaults
      const defaultCategories = ['Nature', 'Portrait', 'Urban', 'Wildlife', 'Landscape', 'Macro'];
      setCategories(defaultCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  const handlePurchase = async (postId, price) => {
    if (!isAuthenticated) {
      alert('Please login to purchase posts');
      return;
    }

    if (price === 0) {
      handleDownload(postId);
      return;
    }

    try {
      const response = await postAPI.purchasePost(postId);
      if (response.data.success) {
        alert('Post purchased successfully!');
        fetchPosts(); // Refresh posts to update purchase status
      }
    } catch (err) {
      alert('Purchase failed. Please try again.');
      console.error('Purchase error:', err);
    }
  };

  const handleDownload = async (postId) => {
    try {
      const response = await postAPI.downloadPost(postId);
      if (response.data.success) {
        // Create a temporary link to download the image
        const link = document.createElement('a');
        link.href = response.data.url;
        link.target = '_blank';
        link.download = 'photo.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert('Download failed. Please try again.');
      console.error('Download error:', err);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-xl font-bold text-gray-900">PhotoMarket</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Dashboard
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Amazing Photos</h1>
          <p className="text-gray-600">Browse through our collection of stunning photography from talented artists</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search posts by title or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters' 
                : 'No posts available yet'
              }
            </p>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  {post.price > 0 && (
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium">
                      ${post.price}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* Author Info */}
                  <div className="flex items-center mb-3">
                    {post.author?.profilePic?.url ? (
                      <img
                        src={post.author.profilePic.url}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-medium text-blue-600">
                          {post.author?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{post.author?.name}</span>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    {post.price === 0 ? (
                      <button
                        onClick={() => handleDownload(post._id)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        Download Free
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchase(post._id, post.price)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {user?.purchases?.some(p => p.post === post._id) ? 'Download' : `Purchase $${post.price}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Post CTA for authenticated users */}
        {isAuthenticated && (
          <div className="fixed bottom-6 right-6">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;