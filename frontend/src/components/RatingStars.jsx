import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ratingApi } from '../api/ratingApi';

const RatingStars = ({ postId, size = 'md', showAverage = true, interactive = true }) => {
  const { user, isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRating();
  }, [postId]);

  const fetchRating = async () => {
    try {
      const response = await ratingApi.getRating(postId);
      setAverageRating(response.data.averageRating || 0);
      setTotalRatings(response.data.totalRatings || 0);

      if (isAuthenticated) {
        const userResponse = await ratingApi.getUserRating(postId);
        setUserRating(userResponse.data.rating || 0);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleRate = async (rating) => {
    if (!isAuthenticated || !interactive) return;

    setLoading(true);
    try {
      await ratingApi.ratePost(postId, rating);
      setUserRating(rating);
      // Refetch average rating
      const response = await ratingApi.getRating(postId);
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);
    } catch (error) {
      console.error('Error rating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            disabled={!interactive || loading || !isAuthenticated}
            className={`${sizeClasses[size]} ${
              interactive && isAuthenticated
                ? 'cursor-pointer hover:scale-110 transition-transform'
                : 'cursor-default'
            } ${loading ? 'opacity-50' : ''}`}
          >
            {star <= (interactive ? userRating : averageRating) ? (
              <span className="text-yellow-400">★</span>
            ) : (
              <span className="text-gray-300">★</span>
            )}
          </button>
        ))}
      </div>
      
      {showAverage && (
        <div className="text-sm text-gray-600 ml-2">
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          {totalRatings > 0 && (
            <span className="text-gray-500"> ({totalRatings})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingStars;