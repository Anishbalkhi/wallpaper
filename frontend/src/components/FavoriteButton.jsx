import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { favoriteApi } from '../api/favoriteApi';

const FavoriteButton = ({ postId, size = 'md' }) => {
  const { user, isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [postId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await favoriteApi.checkFavorite(postId);
      setIsFavorited(response.data.isFavorited);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        await favoriteApi.removeFavorite(postId);
        setIsFavorited(false);
      } else {
        await favoriteApi.addFavorite(postId);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 ${
        isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
      } ${loading ? 'opacity-50' : ''}`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;