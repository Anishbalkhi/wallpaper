import React, { createContext, useState, useContext, useEffect } from 'react';


export const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {

        setUser({ 
          id: '1', 
          name: 'Test User', 
          email: 'test@example.com',
          role: 'user'
        });
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
      

      await new Promise(resolve => setTimeout(resolve, 1000));
      
   
      const user = { 
        id: '1', 
        name: 'Test User', 
        email: email,
        role: 'user'
      };
      const token = 'mock-jwt-token';
      
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
      
    
      await new Promise(resolve => setTimeout(resolve, 1000));
      

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

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
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