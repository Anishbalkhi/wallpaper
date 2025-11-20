import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000/api';
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (authError) {
      console.error('Auth check failed:', authError);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);

      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { user: loggedInUser, token } = response.data;

        localStorage.setItem('token', token);
        setUser(loggedInUser);

        return { success: true };
      }

      throw new Error(response.data.msg);
    } catch (loginError) {
      const message = loginError.response?.data?.msg || loginError.message || 'Login failed';
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

      const response = await axios.post('/auth/signup', userData);

      if (response.data.success) {
        const { user: newUser, token } = response.data;

        localStorage.setItem('token', token);
        setUser(newUser);

        return { success: true };
      }

      throw new Error(response.data.msg);
    } catch (signupError) {
      const message = signupError.response?.data?.msg || signupError.message || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('/auth/logout');
    } catch (logoutError) {
      console.error('Logout error:', logoutError);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setError('');
      setLoading(false);
    }
  };

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
      }

      throw new Error(response.data.msg);
    } catch (updateError) {
      const message = updateError.response?.data?.msg || 'Failed to update profile picture';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const removeProfilePicture = async () => {
    try {
      setLoading(true);

      const updatedUser = {
        ...user,
        profilePic: null
      };

      setUser(updatedUser);

      return { success: true };
    } catch (removeError) {
      const message = removeError.response?.data?.msg || 'Failed to remove profile picture';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      const updatedUser = {
        ...user,
        ...profileData
      };

      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (profileError) {
      const message = profileError.response?.data?.msg || 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);

      const response = await axios.put(`/users/${userId}/role`, { role: newRole });

      if (response.data.success) {
        if (user && user.id === userId) {
          const updatedUser = {
            ...user,
            role: newRole
          };
          setUser(updatedUser);
        }

        return { success: true };
      }

      throw new Error(response.data.msg);
    } catch (roleError) {
      const message = roleError.response?.data?.msg || 'Failed to update user role';
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

