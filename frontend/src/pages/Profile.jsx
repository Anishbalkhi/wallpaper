import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import ImageUpload from '../components/ImageUpload';
import EditProfileForm from '../components/EditProfileForm';

const Profile = () => {
  const { user, loading, updateProfilePicture, removeProfilePicture, updateProfile } = useAuth();
  const [profileStats, setProfileStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Mock data for profile stats and activity
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoadingStats(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock profile statistics
        setProfileStats({
          totalPosts: 12,
          totalSales: 8,
          totalEarnings: 245.50,
          profileViews: 156,
          followers: 42,
          following: 28
        });

        // Mock recent activity
        setRecentActivity([
          {
            id: 1,
            type: 'sale',
            message: 'Your photo "Sunset Mountains" was purchased by @jane_doe',
            amount: 29.99,
            timestamp: '2 hours ago',
            icon: '💰'
          },
          {
            id: 2,
            type: 'like',
            message: '@photography_lover liked your photo "Urban Night"',
            timestamp: '5 hours ago',
            icon: '❤️'
          },
          {
            id: 3,
            type: 'follow',
            message: '@travel_photographer started following you',
            timestamp: '1 day ago',
            icon: '👥'
          },
          {
            id: 4,
            type: 'comment',
            message: '@nature_lover commented: "Amazing capture!" on your photo',
            timestamp: '2 days ago',
            icon: '💬'
          }
        ]);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (user) {
      loadProfileData();
    }
  }, [user]);

  const handleUploadComplete = async (imageData) => {
    try {
      const result = await updateProfilePicture(imageData);
      if (result.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    }
  };

  const handleRemovePicture = async () => {
    try {
      const result = await removeProfilePicture();
      if (result.success) {
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
    }
  };

  const handleEditSave = (updatedData) => {
    setEditSuccess(true);
    setShowEditModal(false);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const formatSocialLink = (platform, url) => {
    if (!url) return null;
    
    if (url.startsWith('http')) {
      return url;
    }
    
    const platforms = {
      twitter: `https://twitter.com/${url}`,
      instagram: `https://instagram.com/${url}`,
      facebook: `https://facebook.com/${url}`
    };
    
    return platforms[platform] || url;
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile.</p>
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Success Messages */}
      {uploadSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          Profile picture updated successfully!
        </div>
      )}
      
      {editSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          Profile updated successfully!
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-28 h-28 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-600">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                  title="Change profile picture"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="pb-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                {user.location && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {user.location}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">Joined {new Date().toLocaleDateString()}</p>
                
                {/* Social Links */}
                {(user.website || user.twitter || user.instagram || user.facebook) && (
                  <div className="flex space-x-3 mt-3">
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      </a>
                    )}
                    {user.twitter && (
                      <a href={formatSocialLink('twitter', user.twitter)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {user.instagram && (
                      <a href={formatSocialLink('instagram', user.instagram)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {user.facebook && (
                      <a href={formatSocialLink('facebook', user.facebook)} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Link 
                to="/dashboard" 
                className="btn-secondary"
              >
                Back to Dashboard
              </Link>
              <button 
                onClick={() => setShowEditModal(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'photos', 'activity', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Statistics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Statistics</h2>
            
            {isLoadingStats ? (
              <div className="flex justify-center py-8">
                <Loader size="small" text="Loading stats..." />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Photos</span>
                  <span className="font-semibold text-gray-900">{profileStats?.totalPosts}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold text-gray-900">{profileStats?.totalSales}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">${profileStats?.totalEarnings}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">{profileStats?.profileViews}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Followers</span>
                  <span className="font-semibold text-gray-900">{profileStats?.followers}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Following</span>
                  <span className="font-semibold text-gray-900">{profileStats?.following}</span>
                </div>
              </div>
            )}
          </div>

          {/* Profile Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full btn-primary text-sm py-2"
              >
                Upload New Picture
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="w-full btn-secondary text-sm py-2"
              >
                Edit Profile Info
              </button>
              {user.profilePic && (
                <button
                  onClick={handleRemovePicture}
                  className="w-full btn-secondary text-sm py-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Remove Picture
                </button>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Member ID</label>
                <p className="text-gray-900 font-mono">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Type</label>
                <p className="text-gray-900 capitalize">{user.role}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Verified</label>
                <p className="text-green-600 font-medium">Verified</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Member Since</label>
                <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <>
              {/* About Section */}
              {user.bio && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">About</h2>
                    <button 
                      onClick={() => setShowEditModal(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit Bio
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{user.bio}</p>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                
                {isLoadingStats ? (
                  <div className="flex justify-center py-8">
                    <Loader size="small" text="Loading activity..." />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900">{activity.message}</p>
                          <p className="text-sm text-gray-500 mt-1">{activity.timestamp}</p>
                          {activity.amount && (
                            <p className="text-sm font-medium text-green-600 mt-1">
                              +${activity.amount}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'photos' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                      <p className="text-xs text-gray-500">Photo {item}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <button className="btn-primary">
                  Upload New Photo
                </button>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Activity</h2>
              {/* Extended activity timeline would go here */}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
              <div className="space-y-4">
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="btn-primary"
                >
                  Edit Profile Information
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-secondary"
                >
                  Change Profile Picture
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Update Profile Picture</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <ImageUpload
                onUploadComplete={handleUploadComplete}
                currentImage={user.profilePic}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Profile</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <EditProfileForm
                onSave={handleEditSave}
                onCancel={handleEditCancel}
                currentUser={user}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;