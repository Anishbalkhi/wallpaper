import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../services/api';
import Loader from '../components/ui/Loader';
import ImageUpload from '../components/ImageUpload';
import EditProfileForm from '../components/EditProfileForm';
import { Camera, Edit3, Upload, Image, DollarSign, ShoppingBag, Calendar, Shield, X, MapPin, Phone, Globe, Instagram, Twitter } from 'lucide-react';

const Profile = () => {
  const { user, loading, updateProfilePicture, updateProfile } = useAuth();

  const [myPosts, setMyPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      if (!user?._id) return;
      setIsLoadingPosts(true);
      try {
        const res = await postAPI.getPosts({ author: user._id, limit: 100 });
        const posts = res.data?.posts || [];
        setMyPosts(posts);
        setTotalPosts(res.data?.pagination?.total || posts.length);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setIsLoadingPosts(false);
      }
    };
    loadPosts();
  }, [user?._id]);

  const handleUploadComplete = async (file) => {
    try {
      const result = await updateProfilePicture(file);
      if (result.success) {
        setUploadSuccess(true);
        setShowUploadModal(false);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleEditSave = async (updatedData) => {
    try {
      const result = await updateProfile(updatedData);
      if (result.success) {
        setEditSuccess(true);
        setShowEditModal(false);
        setTimeout(() => setEditSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Edit failed", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto animate-fadeUp">
        <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-6">Please log in to view your profile.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const stats = [
    { icon: Image, label: 'Photos', value: totalPosts, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50', text: 'text-blue-600' },
    { icon: ShoppingBag, label: 'Sales', value: user.totalSales || 0, color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { icon: DollarSign, label: 'Earnings', value: `$${(user.earnings || 0).toFixed(2)}`, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fadeUp">
      {/* Success Toasts */}
      {(uploadSuccess || editSuccess) && (
        <div className="fixed top-6 right-6 z-50 animate-slideDown">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg shadow-green-600/30 flex items-center gap-2 text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {uploadSuccess ? 'Profile picture updated!' : 'Profile updated!'}
          </div>
        </div>
      )}

      {/* ───── HERO HEADER ───── */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-44 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
          <div className="absolute top-16 left-16 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-8 right-16 w-56 h-56 bg-purple-300/15 rounded-full blur-3xl"></div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-36 h-36 bg-white rounded-full p-1.5 shadow-xl">
                  {user.profilePic?.url ? (
                    <img
                      src={user.profilePic.url}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg ring-3 ring-white hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all duration-200"
                  title="Change photo"
                >
                  <Camera size={18} />
                </button>
              </div>

              {/* Name + Info */}
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 mt-1">{user.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar size={12} />
                    Joined {memberSince}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full capitalize">
                    <Shield size={12} />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <Edit3 size={15} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───── STATS ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fadeUp">
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

      {/* ───── TABS ───── */}
      <div className="bg-white rounded-2xl shadow-sm border mb-6 overflow-hidden">
        <nav className="flex">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'photos', label: `Photos (${totalPosts})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-4 text-sm font-semibold transition-all duration-200 relative ${activeTab === tab.key
                ? 'text-indigo-600'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ───── CONTENT ───── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* About & Details */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">About</h2>
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
              >
                <Edit3 size={14} />
                Edit
              </button>
            </div>

            {/* Bio */}
            {user.bio ? (
              <p className="text-gray-600 leading-relaxed mb-5">{user.bio}</p>
            ) : (
              <p className="text-gray-400 text-sm italic mb-5">No bio added yet.</p>
            )}

            {/* Info Grid */}
            {(user.location || user.phone || user.website || user.instagram || user.twitter) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                {user.location && (
                  <InfoItem icon={<MapPin size={15} />} label="Location" value={user.location} />
                )}
                {user.phone && (
                  <InfoItem icon={<Phone size={15} />} label="Phone" value={user.phone} />
                )}
                {user.website && (
                  <InfoItem icon={<Globe size={15} />} label="Website" value={user.website} isLink />
                )}
                {user.instagram && (
                  <InfoItem icon={<Instagram size={15} />} label="Instagram" value={`@${user.instagram.replace('@', '')}`} href={`https://instagram.com/${user.instagram.replace('@', '')}`} />
                )}
                {user.twitter && (
                  <InfoItem icon={<Twitter size={15} />} label="Twitter" value={`@${user.twitter.replace('@', '')}`} href={`https://x.com/${user.twitter.replace('@', '')}`} />
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-5 text-center mt-2">
                <p className="text-gray-400 text-sm mb-3">Complete your profile with location, website, and social links.</p>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
                >
                  + Add details
                </button>
              </div>
            )}
          </div>

          {/* Recent Photos */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">Recent Photos</h2>
              {myPosts.length > 0 && (
                <button
                  onClick={() => setActiveTab('photos')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
                >
                  View All →
                </button>
              )}
            </div>
            {isLoadingPosts ? (
              <div className="flex justify-center py-12">
                <Loader size="small" text="Loading photos..." />
              </div>
            ) : myPosts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {myPosts.slice(0, 6).map((post) => (
                  <PhotoCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyPhotos />
            )}
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-gray-900 mb-5">All Photos ({totalPosts})</h2>
          {isLoadingPosts ? (
            <div className="flex justify-center py-12">
              <Loader size="small" text="Loading photos..." />
            </div>
          ) : myPosts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {myPosts.map((post) => (
                <PhotoCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyPhotos />
          )}
        </div>
      )}

      {/* ───── MODALS ───── */}
      {showUploadModal && (
        <Modal title="Update Profile Picture" onClose={() => setShowUploadModal(false)}>
          <ImageUpload
            onUploadComplete={handleUploadComplete}
            currentImage={user.profilePic?.url}
          />
        </Modal>
      )}

      {showEditModal && (
        <Modal title="Edit Profile" onClose={() => setShowEditModal(false)} wide>
          <EditProfileForm
            onSave={handleEditSave}
            onCancel={() => setShowEditModal(false)}
            currentUser={user}
          />
        </Modal>
      )}
    </div>
  );
};

export default Profile;

/* ───── SUB COMPONENTS ───── */

const PhotoCard = ({ post }) => (
  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden group relative cursor-pointer">
    <img
      src={post.image}
      alt={post.title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
      <p className="text-white text-sm font-semibold truncate drop-shadow-sm">{post.title}</p>
      <p className="text-white/70 text-xs mt-0.5">
        {post.price > 0 ? `₹${post.price}` : 'Free'} · {post.sales || 0} sales
      </p>
    </div>
    {/* Price badge */}
    <div className="absolute top-2 right-2">
      {post.price === 0 ? (
        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Free</span>
      ) : (
        <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">₹{post.price}</span>
      )}
    </div>
  </div>
);

const EmptyPhotos = () => (
  <div className="text-center py-14 bg-gray-50 rounded-xl">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Image size={28} className="text-gray-300" />
    </div>
    <p className="text-gray-500 mb-1 font-medium">No photos yet</p>
    <p className="text-gray-400 text-sm mb-5">Upload your first photo to get started</p>
    <Link
      to="/post/create"
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm"
    >
      <Upload size={16} />
      Upload Photo
    </Link>
  </div>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={onClose}>
    <div
      className={`bg-white rounded-2xl shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto animate-scaleIn`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value, isLink, href }) => {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="text-gray-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
  }
  if (isLink) {
    const url = value.startsWith('http') ? value : `https://${value}`;
    return <a href={url} target="_blank" rel="noopener noreferrer">{content}</a>;
  }
  return content;
};