import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Loader from '../components/Loader';

// Lazy load components for better performance
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Auth/Login'));
const Signup = lazy(() => import('../pages/Auth/Signup'));
const Profile = lazy(() => import('../pages/Profile'));

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes - Placeholder for now */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <p>Admin features coming soon...</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;