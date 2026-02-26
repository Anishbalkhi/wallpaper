import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postAPI } from '../../services/api';
import Loader from '../ui/Loader';
import { Image, Upload, DollarSign, ShoppingBag, Eye } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await postAPI.getPosts({ limit: 10, sortBy: 'createdAt', order: 'desc' });
        if (res.data?.success) {
          setPosts(res.data.posts || []);
          setTotalPosts(res.data.pagination?.total || res.data.posts?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const stats = [
    { icon: Image, label: 'Platform Posts', value: totalPosts, bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: Upload, label: 'Your Uploads', value: user?.posts?.length || 0, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { icon: ShoppingBag, label: 'Your Sales', value: user?.totalSales || 0, bg: 'bg-purple-50', text: 'text-purple-600' },
    { icon: DollarSign, label: 'Your Earnings', value: `$${(user?.earnings || 0).toFixed(2)}`, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-fadeUp">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Manager Dashboard</h1>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  Manager
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Welcome back, <span className="font-semibold text-white">{user?.name || 'Manager'}</span>. Review and manage content across the platform.
              </p>
            </div>
            <div className="flex gap-3 self-start">
              <Link
                to="/profile"
                className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium border border-white/20"
              >
                View Profile
              </Link>
              <Link
                to="/post/create"
                className="px-5 py-2.5 bg-white text-purple-700 rounded-xl hover:bg-white/90 transition-all duration-200 text-sm font-bold shadow-sm flex items-center gap-2"
              >
                <Upload size={15} />
                Upload Photo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 animate-fadeUp">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon size={22} className={stat.text} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Platform Uploads */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-900">Latest Platform Uploads</h2>
          <Link to="/" className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors flex items-center gap-1">
            <Eye size={14} />
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="medium" text="Loading posts..." />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-14 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Image size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-1">No posts yet</p>
            <p className="text-gray-400 text-sm mb-5">Be the first to upload a photo!</p>
            <Link
              to="/post/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 text-sm font-medium"
            >
              <Upload size={16} />
              Upload Photo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.slice(0, 6).map((post) => (
              <div key={post._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Price badge */}
                  <div className="absolute top-2 right-2">
                    {post.price === 0 ? (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">Free</span>
                    ) : (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">₹{post.price}</span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{post.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[8px] font-bold">
                        {post.author?.name?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs text-gray-500">{post.author?.name || 'Unknown'}</span>
                    </div>
                    {post.category && (
                      <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{post.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;