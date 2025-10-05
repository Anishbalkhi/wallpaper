import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import api from "../api/axios";
import { AuthContext } from "./auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer;

    const initAuth = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        // Decode token for basic user info
        const decoded = jwtDecode(token);
        const payloadUser = decoded.user ?? decoded;
        setUser(payloadUser);

        // Save token to localStorage
        localStorage.setItem("token", token);

        // Refresh full user info from API (to get avatar etc.)
        const res = await api.get("/api/users/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));

        const msRemaining = decoded.exp * 1000 - Date.now();
        if (msRemaining <= 0) { handleLogout(); return; }

        timer = setTimeout(handleLogout, msRemaining);
      } catch (err) {
        console.error("Auth initialization failed:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => clearTimeout(timer);
  }, [token]);

  const handleLogin = async (credentials) => {
    try {
      const res = await api.post("/api/auth/login", credentials);
      const newToken = res.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // Refresh user after login
      const userRes = await api.get("/api/users/me");
      setUser(userRes.data);
      localStorage.setItem("user", JSON.stringify(userRes.data));
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUserFromAPI = async () => {
    try {
      const res = await api.get("/api/users/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.warn("Could not refresh user", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loading, login: handleLogin, logout: handleLogout, refreshUser: refreshUserFromAPI }}
    >
      {children}
    </AuthContext.Provider>
  );
};

