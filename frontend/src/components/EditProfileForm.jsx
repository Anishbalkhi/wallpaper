import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Instagram, Twitter, User } from 'lucide-react';

const EditProfileForm = ({ onSave, onCancel, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    instagram: '',
    twitter: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [bioLength, setBioLength] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        phone: currentUser.phone || '',
        website: currentUser.website || '',
        instagram: currentUser.instagram || '',
        twitter: currentUser.twitter || '',
      });
      setBioLength(currentUser.bio?.length || 0);
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'bio') setBioLength(value.length);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    if (formData.bio.length > 200) newErrors.bio = 'Bio must be 200 characters or less';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (onSave) {
        await onSave({
          name: formData.name.trim(),
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          website: formData.website,
          instagram: formData.instagram,
          twitter: formData.twitter,
        });
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <InputField
        label="Full Name *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Enter your full name"
        icon={<User size={16} className="text-gray-400" />}
      />

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          value={formData.bio}
          onChange={handleChange}
          className={`w-full border rounded-xl px-4 py-2.5 resize-none text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${errors.bio ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="Tell us about yourself and your photography style..."
          maxLength={200}
        />
        <div className="flex justify-between mt-1">
          <p className={`text-xs ${bioLength > 180 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
            {bioLength}/200
          </p>
          {errors.bio && <p className="text-xs text-red-500">{errors.bio}</p>}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact & Location</p>
      </div>

      {/* Location + Phone side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Mumbai, India"
          icon={<MapPin size={16} className="text-gray-400" />}
        />
        <InputField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. +91 98765 43210"
          icon={<Phone size={16} className="text-gray-400" />}
        />
      </div>

      {/* Website */}
      <InputField
        label="Website"
        name="website"
        value={formData.website}
        onChange={handleChange}
        placeholder="e.g. https://yoursite.com"
        icon={<Globe size={16} className="text-gray-400" />}
      />

      {/* Divider */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Social Links</p>
      </div>

      {/* Social side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Instagram"
          name="instagram"
          value={formData.instagram}
          onChange={handleChange}
          placeholder="@username"
          icon={<Instagram size={16} className="text-gray-400" />}
        />
        <InputField
          label="Twitter / X"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="@username"
          icon={<Twitter size={16} className="text-gray-400" />}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
  );
};

export default EditProfileForm;

/* Reusable input with left icon */
const InputField = ({ label, name, value, onChange, placeholder, error, icon }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
      )}
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-xl ${icon ? 'pl-9' : 'pl-4'} pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);