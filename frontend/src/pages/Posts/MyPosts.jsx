import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../api/postApi';
import PostCard from '../../components/PostCard';
import Loader from '../../components/Loader';
import { Link } from 'react-router-dom';

const MyPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const response = await postApi.getMyPosts();
      setPosts(response.data.posts); // Fixed: access response.data.posts
    } catch (error) {
      setError('Failed to load your posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallpapers</h1>
            <p className="text-gray-600">Manage your uploaded wallpapers</p>
          </div>
          <Link
            to="/create-post"
            className="btn btn-primary"
          >
            Upload New
          </Link>
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
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No wallpapers yet</h3>
          <p className="text-gray-500 mb-6">Start sharing your beautiful wallpapers with the community</p>
          <Link
            to="/create-post"
            className="btn btn-primary"
          >
            Upload Your First Wallpaper
          </Link>
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

export default MyPosts;