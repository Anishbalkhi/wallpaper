import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, placeholder = "Search wallpapers...", size = "md" }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'py-2 text-sm',
    md: 'py-3',
    lg: 'py-4 text-lg'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = new URLSearchParams();
    if (query) searchParams.append('q', query);
    if (category) searchParams.append('category', category);
    if (priceRange) searchParams.append('priceRange', priceRange);

    if (onSearch) {
      onSearch({ query, category, priceRange });
    } else {
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setPriceRange('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Main Search Input */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className={`w-full input pl-10 ${sizeClasses[size]}`}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary whitespace-nowrap"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn btn-secondary whitespace-nowrap"
          >
            {showAdvanced ? 'Simple' : 'Advanced'}
          </button>
        </div>

        {/* Advanced Search Options */}
        {showAdvanced && (
          <div className="card p-4 space-y-3 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  <option value="Nature">Nature</option>
                  <option value="Abstract">Abstract</option>
                  <option value="Technology">Technology</option>
                  <option value="Art">Art</option>
                  <option value="Minimal">Minimal</option>
                  <option value="Space">Space</option>
                  <option value="Animals">Animals</option>
                  <option value="City">City</option>
                  <option value="Fantasy">Fantasy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="input"
                >
                  <option value="">Any Price</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                  <option value="0-5">$0 - $5</option>
                  <option value="5-10">$5 - $10</option>
                  <option value="10-20">$10 - $20</option>
                  <option value="20+">$20+</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
              <div className="text-sm text-gray-500">
                Find exactly what you're looking for
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;