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
          setUser({ 
            id: '1', 
            name: 'Test User', 
            email: 'test@example.com',
            role: 'user'
          });
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
      
      // Simulate successful login
      const user = { 
        id: '1', 
        name: 'Test User', 
        email: email,
        role: 'user'
      };
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
        role: 'user'
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
      setUser(null);
      setError('');
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
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};