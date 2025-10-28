import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchApi } from '../api/searchApi';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchData = {
      query: params.get('q') || '',
      category: params.get('category') || '',
      priceRange: params.get('priceRange') || ''
    };
    
    setSearchParams(searchData);
    performSearch(searchData);
  }, [location.search]);

  const performSearch = async (params) => {
    if (!params.query && !params.category && !params.priceRange) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    try {
      const response = await searchApi.searchPosts(params);
      setResults(response.data.posts || []);
      setTotalResults(response.data.total || response.data.posts?.length || 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newParams) => {
    const params = new URLSearchParams();
    if (newParams.query) params.append('q', newParams.query);
    if (newParams.category) params.append('category', newParams.category);
    if (newParams.priceRange) params.append('priceRange', newParams.priceRange);
    
    window.history.pushState({}, '', `/search?${params.toString()}`);
    setSearchParams(newParams);
    performSearch(newParams);
  };

  const getSearchSummary = () => {
    const parts = [];
    if (searchParams.query) parts.push(`"${searchParams.query}"`);
    if (searchParams.category) parts.push(`in ${searchParams.category}`);
    if (searchParams.priceRange) {
      const priceText = {
        'free': 'free',
        'paid': 'paid',
        '0-5': 'under $5',
        '5-10': '$5-$10',
        '10-20': '$10-$20',
        '20+': 'over $20'
      }[searchParams.priceRange] || searchParams.priceRange;
      parts.push(`priced ${priceText}`);
    }

    return parts.join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Wallpapers</h1>
        <p className="text-gray-600">Find the perfect wallpaper for your device</p>
      </div>

      {/* Search Bar */}
      <div className="card p-6 mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Search Results */}
      <div className="mb-6">
        {loading ? (
          <Loader />
        ) : searchParams.query || searchParams.category || searchParams.priceRange ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Search Results
                </h2>
                {totalResults > 0 && (
                  <p className="text-gray-600">
                    Found {totalResults} results for {getSearchSummary()}
                  </p>
                )}
              </div>
            </div>

            {totalResults === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={() => handleSearch({})}
                  className="btn btn-primary"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Start Searching</h3>
            <p className="text-gray-500">
              Use the search bar above to find wallpapers by title, category, or price
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;