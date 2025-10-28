import { useState, useEffect } from 'react';
import { postApi } from '../../api/postApi';
import PostCard from '../../components/PostCard';
import Loader from '../../components/Loader';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    tags: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    fetchPosts();
  }, [filters.category, filters.tags]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postApi.getPosts(filters);
      setPosts(response.data.posts || response.data);
    } catch (error) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Wallpapers</h1>
        <p className="text-gray-600">Discover beautiful wallpapers created by our community</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="Nature">Nature</option>
              <option value="Abstract">Abstract</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Minimal">Minimal</option>
              <option value="Space">Space</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={filters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              placeholder="e.g., sunset, mountain, blue"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🖼️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No wallpapers found</h3>
          <p className="text-gray-500">Try adjusting your filters or be the first to upload a wallpaper!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;