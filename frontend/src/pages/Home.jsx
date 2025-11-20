import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [limit] = useState(12); // Show 12 latest photos on home page

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await postAPI.getPosts({ 
        limit,
        page: 1
      });
      
      if (response.data.success) {
        setPosts(response.data.posts || []);
      } else {
        setError('Failed to load photos');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Error loading photos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-12">
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 py-20 px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Welcome to PhotoMarket
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover, share, and sell stunning photography. Join our community of photographers and art enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/signup" 
                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    to="/login" 
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Showcase Your Work</h3>
          <p className="text-gray-600">
            Upload and display your best photographs in a beautiful portfolio that represents your unique style.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sell Your Photos</h3>
          <p className="text-gray-600">
            Monetize your photography by selling digital downloads and prints to a global audience of buyers.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Join Community</h3>
          <p className="text-gray-600">
            Connect with fellow photographers, get feedback, and grow together in our supportive community.
          </p>
        </div>
      </div>

      {/* Featured Photos Gallery */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Photos</h2>
            <p className="text-gray-600">Discover amazing photography from our community</p>
          </div>
          <Link 
            to="/posts" 
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
          >
            View All
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading photos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your photography!</p>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Upload Your First Photo
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post) => (
              <Link
                key={post._id}
                to={isAuthenticated ? `/posts` : `/login`}
                className="group bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative aspect-square bg-gray-200 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  {post.price > 0 && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${post.price}
                    </div>
                  )}
                  {post.price === 0 && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Free
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold text-lg line-clamp-2 mb-1">
                        {post.title}
                      </p>
                      {post.author && (
                        <div className="flex items-center text-white/90 text-sm">
                          {post.author.profilePic?.url ? (
                            <img
                              src={post.author.profilePic.url}
                              alt={post.author.name}
                              className="w-5 h-5 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-medium">
                                {post.author.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          )}
                          <span>{post.author.name || 'Unknown'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.author && (
                    <p className="text-sm text-gray-500 mb-2">
                      by {post.author.name || 'Unknown'}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{post.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
            <div className="text-gray-600">Active Photographers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{posts.length > 0 ? '50K+' : '0'}</div>
            <div className="text-gray-600">Photos Uploaded</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">$1M+</div>
            <div className="text-gray-600">Total Sales</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">150+</div>
            <div className="text-gray-600">Countries</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Photography Journey?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of photographers who are already sharing their work and building their photography business.
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors inline-block"
          >
            Create Your Free Account
          </Link>
        </div>
      )}

      {/* For logged-in users */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Continue your photography journey. Manage your portfolio, track sales, and connect with the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/dashboard" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              to="/profile" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;