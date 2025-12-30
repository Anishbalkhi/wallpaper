import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const ImageUpload = ({ onUploadComplete, currentImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const { user } = useAuth();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const simulateUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadProgress(i);
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const mockCloudinaryResponse = {
      url: previewUrl,
      publicId: `profile_${user?._id || user?.id || 'user'}_${Date.now()}`,
      format: selectedImage.type.split('/')[1]
    };

    setIsUploading(false);
    setUploadProgress(0);
    
    if (onUploadComplete) {
      onUploadComplete(mockCloudinaryResponse);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(currentImage);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {selectedImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">New</span>
                </div>
              )}
            </div>
          </div>
        )}

        {!previewUrl && (
          <div className="py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
          {!selectedImage && !isUploading && (
            <>
              <button
                type="button"
                onClick={triggerFileInput}
                className="btn-primary text-sm py-2 px-4"
              >
                Choose Image
              </button>
              {previewUrl && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Remove
                </button>
              )}
            </>
          )}

          {selectedImage && !isUploading && (
            <>
              <button
                type="button"
                onClick={simulateUpload}
                className="btn-primary text-sm py-2 px-4"
              >
                Upload Picture
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="btn-secondary text-sm py-2 px-4"
              >
                Cancel
              </button>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 For best results, use a square image at least 400x400 pixels.</p>
      </div>
    </div>
  );
};

export default ImageUpload;