import { Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/auth.js";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function Nav() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex flex-wrap justify-between items-center p-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <Link
        to="/"
        className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition"
      >
        NeonFeed
      </Link>
      <div className="flex gap-4 flex-wrap items-center mt-2 sm:mt-0">
        {user && (
          <Link className="hover:text-pink-400 transition font-medium" to="/">
            Feed
          </Link>
        )}
        {user ? (
          <>
            <Link className="hover:text-purple-400 transition font-medium" to="/create">
              Create
            </Link>
            <Link className="hover:text-green-400 transition font-medium" to="/profile">
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-500 transition px-3 py-1 rounded font-semibold text-white shadow-md shadow-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="hover:text-blue-400 transition font-medium" to="/login">
              Login
            </Link>
            <Link className="hover:text-yellow-400 transition font-medium" to="/signup">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="bg-black min-h-screen text-white font-sans">
        <Nav />
        <div className="p-4">
          <Routes>
            {/* Protected Feed */}
            <Route
              path="/"
              element={
                <ProtectedRoute permission="read_posts">
                  <Feed />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/create"
              element={
                <ProtectedRoute permission="create_posts">
                  <CreatePost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute permission="upload_profile_pic">
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}
