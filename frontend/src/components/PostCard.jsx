import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../api/postApi';
import RatingStars from './RatingStars';
import FavoriteButton from './FavoriteButton';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = async () => {
    if (post.price > 0 && !post.purchased) {
      alert('You need to purchase this wallpaper first!');
      return;
    }

    setLoading(true);
    try {
      const response = await postApi.downloadPost(post._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wallpaper-${post._id}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await postApi.purchasePost(post._id);
      alert('Purchase successful! You can now download the wallpaper.');
      window.location.reload();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    try {
      await postApi.deletePost(post._id);
      onDelete(post._id);
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      {/* Image with Overlay */}
      <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
        <Link to={`/post/${post._id}`}>
          <img
            src={imageError ? '/placeholder-image.jpg' : post.image}
            alt={post.title}
            className="w-full h-48 object-cover"
            onError={() => setImageError(true)}
          />
        </Link>
        
        {/* Favorite Button Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <FavoriteButton postId={post._id} size="sm" />
        </div>

        {/* Price Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            post.price > 0 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {post.price > 0 ? `$${post.price}` : 'Free'}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <Link to={`/post/${post._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars 
            postId={post._id} 
            size="sm" 
            showAverage={true}
            interactive={false}
          />
        </div>

        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {post.category}
          </span>
          {post.tags?.slice(0, 2).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
          {post.tags && post.tags.length > 2 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              +{post.tags.length - 2}
            </span>
          )}
        </div>

        {/* Author and Stats */}
        <div className="flex justify-between items-center mb-3 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <img
              src={post.author?.profilePic?.url || '/default-avatar.png'}
              alt={post.author?.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{post.author?.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span>👁️ {post.viewCount || 0}</span>
            <span>💾 {post.downloadCount || 0}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {post.price > 0 && !post.purchased ? (
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 btn btn-primary text-sm disabled:opacity-50"
            >
              {loading ? '...' : `Buy $${post.price}`}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 btn btn-primary text-sm disabled:opacity-50"
            >
              {loading ? '...' : 'Download'}
            </button>
          )}

          {/* Delete button for post author or admin */}
          {(user?._id === post.author?._id || user?.role === 'admin') && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;