import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { postAPI } from "../services/api";
import PinterestGrid from "../components/ui/PinterestGrid";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        let params = { page: 1, limit: 50 };

        switch (activeFilter) {
          case 'latest':
            params = { ...params, sortBy: 'createdAt', order: 'desc' };
            break;
          case 'oldest':
            params = { ...params, sortBy: 'createdAt', order: 'asc' };
            break;
          case 'free':
            params = { ...params, maxPrice: 0 };
            break;
          case 'paid':
            params = { ...params, minPrice: 0.01 };
            break;
          default:
            break;
        }

        if (searchQuery.trim()) {
          params.tags = searchQuery.trim();
        }

        const res = await postAPI.getPosts(params);
        if (res.data?.success) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeFilter, searchQuery]);

  const filters = [
    { key: 'latest', label: '🕐 Latest' },
    { key: 'oldest', label: '📅 Oldest' },
    { key: 'free', label: '🎁 Free' },
    { key: 'paid', label: '💎 Paid' },
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-4 pb-24">

      {/* TOP BAR: Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 animate-fadeUp">

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tags..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === f.key
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
            >
              {f.label}
            </button>
          ))}
          {(activeFilter !== 'latest' || searchQuery) && (
            <button
              onClick={() => { setActiveFilter('latest'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-full text-sm font-medium text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-all duration-200"
            >
              ✕ Reset
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      {loading ? (
        <Skeleton />
      ) : posts.length === 0 ? (
        <div className="text-center py-20 animate-fadeUp">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <PinterestGrid posts={posts} />
        </div>
      )}

      {/* FAB - Create Post */}
      {isAuthenticated && (
        <button
          onClick={() => navigate("/post/create")}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center"
          title="Upload a photo"
        >
          <Plus size={26} />
        </button>
      )}
    </div>
  );
};

export default Home;

/* UI HELPERS */
const Skeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="bg-gray-200 rounded-2xl animate-pulse"
        style={{ height: `${180 + Math.random() * 120}px` }}
      />
    ))}
  </div>
);
