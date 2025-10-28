import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postApi } from '../api/postApi';
import { userApi } from '../api/userApi';
import PostCard from '../components/PostCard';
import Loader from '../components/Loader';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [purchasedPosts, setPurchasedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalPurchases: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    if (activeTab === 'my-posts') {
      fetchUserPosts();
    } else if (activeTab === 'purchased') {
      fetchPurchasedPosts();
    }
  }, [activeTab]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const response = await postApi.getMyPosts();
      setUserPosts(response.data.posts);
      setStats(prev => ({ ...prev, totalPosts: response.data.posts.length }));
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedPosts = async () => {
    setLoading(true);
    try {
      const response = await postApi.getPurchasedPosts();
      setPurchasedPosts(response.data.posts);
      setStats(prev => ({ ...prev, totalPurchases: response.data.posts.length }));
    } catch (error) {
      console.error('Error fetching purchased posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await postApi.uploadProfilePic(formData);
      updateUser(response.data.user);
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    setUserPosts(userPosts.filter(post => post._id !== postId));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={user?.profilePic?.url || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                className="hidden"
                disabled={loading}
              />
              📷
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{stats.totalPosts}</div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{stats.totalPurchases}</div>
                <div className="text-sm text-gray-500">Purchased</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 capitalize">{user?.role}</div>
                <div className="text-sm text-gray-500">Role</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">About</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'profile', name: 'Profile Info' },
            { id: 'my-posts', name: 'My Wallpapers' },
            { id: 'purchased', name: 'Purchased' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && (
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-lg">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-lg">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p className="text-lg capitalize">{user?.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <p className="text-lg">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-posts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Wallpapers</h2>
              <span className="text-gray-600">
                {userPosts.length} wallpapers
              </span>
            </div>

            {loading ? (
              <Loader />
            ) : userPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🖼️</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No wallpapers yet</h3>
                <p className="text-gray-500">Start sharing your beautiful wallpapers with the community</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userPosts.map((post) => (
                  <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchased' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Purchased Wallpapers</h2>
              <span className="text-gray-600">
                {purchasedPosts.length} purchased
              </span>
            </div>

            {loading ? (
              <Loader />
            ) : purchasedPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No purchases yet</h3>
                <p className="text-gray-500">Purchase some wallpapers to see them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {purchasedPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;