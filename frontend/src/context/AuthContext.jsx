import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create and export the context
export const AuthContext = createContext();

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set axios base URL and credentials
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000/api';
    axios.defaults.withCredentials = true;
  }, []);

  // Enhanced auth persistence
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Use real API to verify token and get user data
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Use real API call
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        setUser(user);
        
        return { success: true };
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      const message = error.response?.data?.msg || error.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      // Use real API call
      const response = await axios.post('/auth/signup', userData);

      if (response.data.success) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        setUser(user);
        
        return { success: true };
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      const message = error.response?.data?.msg || error.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Call backend logout
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      setUser(null);
      setError('');
      setLoading(false);
    }
  };

  // Update profile picture
  const updateProfilePicture = async (imageData) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('file', imageData);

      const response = await axios.post('/users/upload-profile-pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to update profile picture';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Remove profile picture
  const removeProfilePicture = async () => {
    try {
      setLoading(true);
      
      // For removal, you might need to implement a separate endpoint
      // For now, we'll update locally
      const updatedUser = {
        ...user,
        profilePic: null
      };
      
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to remove profile picture';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile information
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      
      // You'll need to implement this endpoint in your backend
      // For now, we'll update locally
      const updatedUser = {
        ...user,
        ...profileData
      };
      
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update user role (for admin use)
  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`/users/${userId}/role`, { role: newRole });
      
      if (response.data.success) {
        // Update current user's role if it's the same user
        if (user && user.id === userId) {
          const updatedUser = {
            ...user,
            role: newRole
          };
          setUser(updatedUser);
        }
        
        return { success: true };
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to update user role';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfilePicture,
    removeProfilePicture,
    updateProfile,
    updateUserRole,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};