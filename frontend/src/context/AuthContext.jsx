import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Enhanced auth persistence with localStorage
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage events to sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        // Token was removed in another tab
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // In a real app, this would verify the token with the backend
        // For now, we'll use mock data but verify token exists
        const isTokenValid = await validateToken(token);
        
        if (isTokenValid) {
          // Check if user has profile data in localStorage
          const savedProfile = localStorage.getItem('userProfile');
          const defaultUser = { 
            id: '1', 
            name: 'Test User', 
            email: 'test@example.com',
            role: localStorage.getItem('userRole') || 'user', // NEW: Get role from localStorage
            profilePic: localStorage.getItem('profilePic') || null
          };
          
          setUser(savedProfile ? { ...defaultUser, ...JSON.parse(savedProfile) } : defaultUser);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('profilePic');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('userRole'); // NEW: Remove role
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('profilePic');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userRole'); // NEW: Remove role
    } finally {
      setLoading(false);
    }
  };

  // Mock token validation
  const validateToken = async (token) => {
    // Simulate API call to validate token
    await new Promise(resolve => setTimeout(resolve, 100));
    return token === 'mock-jwt-token'; // Simple validation for demo
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      // Mock API call - replace with actual API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for saved profile data
      const savedProfile = localStorage.getItem('userProfile');
      const savedProfilePic = localStorage.getItem('profilePic');
      const savedRole = localStorage.getItem('userRole'); // NEW: Get saved role
      
      // Simulate successful login
      const defaultUser = { 
        id: '1', 
        name: 'Test User', 
        email: email,
        role: savedRole || 'user', // NEW: Use saved role or default
        profilePic: savedProfilePic || null
      };
      
      const user = savedProfile ? { ...defaultUser, ...JSON.parse(savedProfile) } : defaultUser;
      const token = 'mock-jwt-token';
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || 'Login failed';
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
      
      // Mock API call - replace with actual API later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful signup
      const user = { 
        id: '1', 
        name: userData.name, 
        email: userData.email,
        role: 'user', // NEW: Default role for new users
        profilePic: null
      };
      const token = 'mock-jwt-token';
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.msg || 'Signup failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Mock API call for logout
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      // Don't remove profilePic, userProfile, and userRole on logout to persist across sessions
      setUser(null);
      setError('');
      setLoading(false);
    }
  };

  // Update profile picture
  const updateProfilePicture = async (imageData) => {
    try {
      setLoading(true);
      
      // Simulate API call to update profile picture
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user state with new profile picture
      const updatedUser = {
        ...user,
        profilePic: imageData.url
      };
      
      setUser(updatedUser);
      
      // Save to localStorage for persistence
      localStorage.setItem('profilePic', imageData.url);
      
      return { success: true };
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
      
      // Simulate API call to remove profile picture
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user state
      const updatedUser = {
        ...user,
        profilePic: null
      };
      
      setUser(updatedUser);
      
      // Remove from localStorage
      localStorage.removeItem('profilePic');
      
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
      
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user state with new profile data
      const updatedUser = {
        ...user,
        ...profileData
      };
      
      setUser(updatedUser);
      
      // Save to localStorage for persistence (excluding sensitive data)
      const { id, role, profilePic, ...profileToSave } = updatedUser;
      localStorage.setItem('userProfile', JSON.stringify(profileToSave));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.msg || 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to update user role (for admin use)
  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      
      // Simulate API call to update role
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update current user's role if it's the same user
      if (user.id === userId) {
        const updatedUser = {
          ...user,
          role: newRole
        };
        
        setUser(updatedUser);
        localStorage.setItem('userRole', newRole); // NEW: Save role to localStorage
      }
      
      return { success: true };
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
    updateUserRole, // NEW: Add role update function
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};