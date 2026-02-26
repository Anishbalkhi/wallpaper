import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userAPI, postAPI } from '../../services/api';
import UserManagement from './UserManagement';
import Loader from '../ui/Loader';
import { Users, Shield, UserCheck, Image, AlertTriangle, Crown } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [userStatsRes, postsRes] = await Promise.all([
          userAPI.getUserStats(),
          postAPI.getPosts({ limit: 6, sortBy: 'createdAt', order: 'desc' }),
        ]);

        if (userStatsRes.data?.success) {
          setStats(userStatsRes.data.stats);
        }
        if (postsRes.data?.success) {
          setPostCount(postsRes.data.pagination?.total || postsRes.data.posts?.length || 0);
          setRecentPosts(postsRes.data.posts || []);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    { title: 'Total Users', value: stats.total, icon: Users, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
    { title: 'Admins', value: stats.admins, icon: Crown, color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
    { title: 'Managers', value: stats.managers, icon: UserCheck, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600' },
    { title: 'Total Posts', value: postCount, icon: Image, color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600' },
    { title: 'Suspended', value: stats.suspended, icon: AlertTriangle, color: 'orange', bg: 'bg-orange-50', text: 'text-orange-600' },
  ] : [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-fadeUp">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-red-600 via-rose-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  Administrator
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Welcome back, <span className="font-semibold text-white">{user?.name}</span>. Full system administration and platform management.
              </p>
            </div>
            <Link
              to="/profile"
              className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium self-start border border-white/20"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <nav className="flex">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'users', label: '👥 Users' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 relative ${activeTab === tab.key
                  ? 'text-red-600'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-red-600 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader size="large" text="Loading platform stats..." />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
                {statCards.map((stat, i) => (
                  <div key={i} className="bg-white rounded-2xl border p-5 hover:shadow-md transition-all duration-200 animate-fadeUp">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                        <stat.icon size={20} className={stat.text} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-gray-900">Recent Uploads</h2>
                  <Link to="/" className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors">
                    View All →
                  </Link>
                </div>
                {recentPosts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {recentPosts.map((post) => (
                      <div key={post._id} className="aspect-video bg-gray-100 rounded-xl overflow-hidden group relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                          <p className="text-white text-sm font-semibold truncate">{post.title}</p>
                          <p className="text-white/70 text-xs">by {post.author?.name || 'Unknown'} · {post.price > 0 ? `₹${post.price}` : 'Free'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-10">No posts on the platform yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 animate-fadeIn">
          <UserManagement />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;