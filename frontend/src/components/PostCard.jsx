import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../api/postApi';

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
      
      // Create blob URL for download
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
      // Refresh the post data or update local state
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
    <div className="card overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Post Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={imageError ? '/placeholder-image.jpg' : post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
          onError={() => setImageError(true)}
        />
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{post.title}</h3>
        
        {/* Categories and Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {post.category}
          </span>
          {post.tags?.slice(0, 3).map((tag, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Price and Author */}
        <div className="flex justify-between items-center mb-3">
          <span className={`text-lg font-bold ${
            post.price > 0 ? 'text-green-600' : 'text-gray-600'
          }`}>
            {post.price > 0 ? `$${post.price}` : 'Free'}
          </span>
          <span className="text-sm text-gray-500">
            by {post.author?.name || 'Unknown'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {post.price > 0 && !post.purchased ? (
            <button
              onClick={handlePurchase}
              disabled={loading}
              className="flex-1 btn btn-primary text-sm disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Purchase $${post.price}`}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 btn btn-primary text-sm disabled:opacity-50"
            >
              {loading ? 'Downloading...' : 'Download'}
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