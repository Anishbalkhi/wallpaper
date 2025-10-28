import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postApi } from '../../api/postApi';
import RatingStars from '../../components/RatingStars';
import FavoriteButton from '../../components/FavoriteButton';
import CommentSection from '../../components/CommentSection';
import Loader from '../../components/Loader';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postApi.getPost(postId);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (post.price > 0 && !post.purchased) {
      alert('You need to purchase this wallpaper first!');
      return;
    }

    setDownloading(true);
    try {
      const response = await postApi.downloadPost(post._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `wallpaper-${post.title}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await postApi.purchasePost(post._id);
      alert('Purchase successful! You can now download the wallpaper.');
      fetchPost(); // Refresh post data
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postApi.deletePost(post._id);
      alert('Post deleted successfully!');
      navigate('/posts');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed. Please try again.');
    }
  };

  if (loading) return <Loader />;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <div className="card p-4">
            <img
              src={imageError ? '/placeholder-image.jpg' : post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-sm"
              onError={() => setImageError(true)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {post.price > 0 && !post.purchased ? (
              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="flex-1 btn btn-primary text-lg py-3 disabled:opacity-50"
              >
                {purchasing ? 'Processing...' : `Purchase for $${post.price}`}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex-1 btn btn-primary text-lg py-3 disabled:opacity-50"
              >
                {downloading ? 'Downloading...' : 'Download Wallpaper'}
              </button>
            )}

            <FavoriteButton postId={post._id} size="lg" />

            {/* Delete button for author or admin */}
            {(user?._id === post.author?._id || user?.role === 'admin') && (
              <button
                onClick={handleDelete}
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Post Header */}
          <div className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  post.price > 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {post.price > 0 ? `$${post.price}` : 'Free'}
                </div>
                {post.purchased && (
                  <div className="text-sm text-green-600 font-medium">Purchased</div>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <RatingStars postId={post._id} size="lg" interactive={true} />
            </div>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
              {post.tags?.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
              <img
                src={post.author?.profilePic?.url || '/default-avatar.png'}
                alt={post.author?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                <p className="text-sm text-gray-500">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{post.downloadCount || 0}</div>
              <div className="text-sm text-gray-500">Downloads</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{post.viewCount || 0}</div>
              <div className="text-sm text-gray-500">Views</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{post.purchaseCount || 0}</div>
              <div className="text-sm text-gray-500">Purchases</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
};

export default PostDetails;