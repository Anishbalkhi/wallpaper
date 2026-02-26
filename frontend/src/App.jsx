import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PublicRoute from './components/routing/PublicRoute';
import Profile from './pages/Profile';
import CreatePost from "./pages/CreatePost";

import "./index.css"
import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Home Route - Conditional Layout */}
      <Route
        path="/"
        element={
          user ? (
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          ) : (
            <Layout>
              <Home />
            </Layout>
          )
        }
      />

      {/* Public Routes restricted to non-authenticated users (Standalone Layout) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Pages inside Main Layout */}
      {/* <Route element={<Layout><Outlet /></Layout>}> */}
      {/* If we had other public pages like "About", "Contact", they would go here */}
      {/* </Route> */}


      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Protected Pages (Profile, CreatePost, etc.) -> Uses DashboardLayout */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/create"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreatePost />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;