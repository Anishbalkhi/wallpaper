import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { favoriteApi } from '../api/favoriteApi';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteApi.getFavorites();
      setFavorites(response.data.favorites || []);
    } catch (error) {
      setError('Failed to load favorites');
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (postId) => {
    setFavorites(favorites.filter(fav => fav._id !== postId));
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Your collection of favorite wallpapers</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Favorites Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">
            Start exploring wallpapers and add your favorites by clicking the heart icon!
          </p>
          <a
            href="/posts"
            className="btn btn-primary"
          >
            Browse Wallpapers
          </a>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'favorite' : 'favorites'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((post) => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={handleRemoveFavorite}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;