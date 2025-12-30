// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "../services/api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // actual current user object (from /users/me)
  const [loading, setLoading] = useState(true); // loading while checking session
  const [error, setError] = useState("");

  // load user from server using httpOnly cookie (no token in localStorage)
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/users/me");
      if (res.data?.success) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post("/auth/login", { email, password });
      if (res.data?.success) {
        // server set httpOnly cookie — now fetch user
        await loadUser();
        return { success: true };
      } else {
        const msg = res.data?.msg || "Login failed";
        setError(msg);
        return { success: false, error: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError("");
      setLoading(true);
      const res = await axios.post("/auth/signup", userData);
      if (res.data?.success) {
        await loadUser();
        return { success: true };
      } else {
        const msg = res.data?.msg || "Signup failed";
        setError(msg);
        return { success: false, error: msg };
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || "Signup failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axios.post("/auth/logout");
    } catch (err) {
      // ignore error, still clear client state
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // upload profile picture (multipart/form-data)
  const updateProfilePicture = async (file) => {
    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file); // backend expects field name "file"
      const res = await axios.post("/users/upload-profile-pic", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        // server should return updated user
        setUser(res.data.user);
        return { success: true };
      }
      return { success: false, error: res.data?.msg || "Upload failed" };
    } catch (err) {
      const msg = err.response?.data?.msg || "Upload failed";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // client-only profile update (you may call backend here in future)
  const updateProfile = async (profileData) => {
    // optionally send to backend (not implemented here)
    const updated = { ...user, ...profileData };
    setUser(updated);
    return { success: true, user: updated };
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      const res = await axios.put(`/users/${userId}/role`, { role: newRole });
      if (res.data?.success) {
        // if admin updated self, reflect change
        if (user && (user._id === userId || user.id === userId)) {
          setUser(res.data.user || { ...user, role: newRole });
        }
        return { success: true };
      }
      return { success: false, error: res.data?.msg || "Role update failed" };
    } catch (err) {
      const msg = err.response?.data?.msg || "Role update failed";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");

  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    updateProfilePicture,
    updateProfile,
    updateUserRole,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
