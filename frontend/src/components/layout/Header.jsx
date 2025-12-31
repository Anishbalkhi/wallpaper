import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow">
              PM
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">
              PhotoMarket
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" label="Home" />
            {isAuthenticated && <NavLink to="/dashboard" label="Dashboard" />}

            {!isAuthenticated ? (
              <>
                <NavLink to="/login" label="Login" />
                <Link to="/signup" className="btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-semibold flex items-center justify-center hover:ring-2 ring-indigo-300 transition"
                >
                  {user?.name?.charAt(0)}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border animate-scaleIn overflow-hidden">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t animate-slideDown">
          <div className="px-4 py-4 space-y-3">
            <MobileLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </MobileLink>

            {isAuthenticated && (
              <MobileLink to="/dashboard" onClick={() => setMenuOpen(false)}>
                Dashboard
              </MobileLink>
            )}

            {!isAuthenticated ? (
              <>
                <MobileLink to="/login" onClick={() => setMenuOpen(false)}>
                  Login
                </MobileLink>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center btn-primary"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <MobileLink to="/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </MobileLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

/* ---------------- Components ---------------- */

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="relative text-sm font-medium text-gray-700 hover:text-gray-900 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-indigo-600 hover:after:w-full after:transition-all"
  >
    {label}
  </Link>
);

const MobileLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
  >
    {children}
  </Link>
);
