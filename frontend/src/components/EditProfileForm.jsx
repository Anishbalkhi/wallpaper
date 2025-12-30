import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EditProfileForm = ({ onSave, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    instagram: '',
    facebook: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bioLength, setBioLength] = useState(0);

  const { updateProfile } = useAuth();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        website: currentUser.website || '',
        twitter: currentUser.twitter || '',
        instagram: currentUser.instagram || '',
        facebook: currentUser.facebook || ''
      });
      setBioLength(currentUser.bio?.length || 0);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'bio') {
      setBioLength(value.length);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (formData.twitter && !isValidSocialHandle(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter handle (without @)';
    }

    if (formData.instagram && !isValidSocialHandle(formData.instagram)) {
      newErrors.instagram = 'Please enter a valid Instagram handle';
    }

    if (formData.facebook && !isValidUrl(formData.facebook) && !isValidSocialHandle(formData.facebook)) {
      newErrors.facebook = 'Please enter a valid Facebook URL or username';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const isValidSocialHandle = (handle) => {
    return /^[a-zA-Z0-9._]+$/.test(handle);
  };

  const formatSocialUrl = (platform, handle) => {
    if (!handle) return '';
    
    if (handle.startsWith('http')) return handle;
    
    const platforms = {
      twitter: `https://twitter.com/${handle}`,
      instagram: `https://instagram.com/${handle}`,
      facebook: `https://facebook.com/${handle}`
    };
    
    return platforms[platform] || handle;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formattedData = {
        ...formData,
        twitter: formatSocialUrl('twitter', formData.twitter),
        instagram: formatSocialUrl('instagram', formData.instagram),
        facebook: formatSocialUrl('facebook', formData.facebook)
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = await updateProfile(formattedData);

      if (result.success && onSave) {
        await onSave(formattedData);
      }
    } catch (error) {
      // Error is handled by updateProfile
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="Where are you based?"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About You</h3>
          
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className={`input-field resize-none ${errors.bio ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Tell us about yourself, your photography style, and what inspires you..."
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-500">
                {bioLength}/500 characters
              </p>
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Links & Social Media</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                id="website"
                name="website"
                type="text"
                value={formData.website}
                onChange={handleChange}
                className={`input-field ${errors.website ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="https://yourwebsite.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    id="twitter"
                    name="twitter"
                    type="text"
                    value={formData.twitter.replace('https://twitter.com/', '')}
                    onChange={handleChange}
                    className={`flex-1 input-field rounded-l-none ${errors.twitter ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="username"
                  />
                </div>
                {errors.twitter && (
                  <p className="mt-1 text-sm text-red-600">{errors.twitter}</p>
                )}
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-pink-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    id="instagram"
                    name="instagram"
                    type="text"
                    value={formData.instagram.replace('https://instagram.com/', '')}
                    onChange={handleChange}
                    className={`flex-1 input-field rounded-l-none ${errors.instagram ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="username"
                  />
                </div>
                {errors.instagram && (
                  <p className="mt-1 text-sm text-red-600">{errors.instagram}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </span>
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  type="text"
                  value={formData.facebook}
                  onChange={handleChange}
                  className={`input-field ${errors.facebook ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="https://facebook.com/username or username"
                />
                {errors.facebook && (
                  <p className="mt-1 text-sm text-red-600">{errors.facebook}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {formData.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{formData.name || 'Your Name'}</p>
                <p className="text-sm text-gray-600">{formData.location || 'Location'}</p>
              </div>
            </div>
            {formData.bio && (
              <p className="text-sm text-gray-700 mb-3">{formData.bio}</p>
            )}
            <div className="flex space-x-3">
              {formData.website && (
                <span className="text-xs text-blue-600">🌐 Website</span>
              )}
              {formData.twitter && (
                <span className="text-xs text-blue-400">🐦 Twitter</span>
              )}
              {formData.instagram && (
                <span className="text-xs text-pink-500">📷 Instagram</span>
              )}
              {formData.facebook && (
                <span className="text-xs text-blue-600">👍 Facebook</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;