import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Image,
    BarChart2,
    Menu,
    X,
    LogOut,
    User,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // closed by default on mobile
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Image, label: 'My Photos', path: '/profile' },
        { icon: BarChart2, label: 'Explore', path: '/' },
    ];

    // Format current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans text-gray-800">
            {/* ───── SIDEBAR ───── */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:relative lg:translate-x-0
                `}
            >
                <div className="h-full flex flex-col p-5">
                    {/* Logo */}
                    <div className="mb-8">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                PM
                            </div>
                            <span className="text-lg font-bold text-gray-900 tracking-tight">PhotoMarket</span>
                        </Link>
                    </div>

                    {/* Close button on mobile */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-5 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors lg:hidden"
                    >
                        <X size={18} />
                    </button>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-3">Marketplace</p>
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = item.path === '/'
                                    ? location.pathname === '/'
                                    : location.pathname.startsWith(item.path);

                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <item.icon
                                            size={18}
                                            className={isActive ? 'text-indigo-600' : 'text-gray-400'}
                                        />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </aside>

            {/* ───── MAIN ───── */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30">
                    {/* Left: Hamburger + Date */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <span>🗓️</span>
                            <span>{formattedDate}</span>
                        </div>
                    </div>

                    {/* Right: Profile */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm ring-2 ring-gray-100">
                                {user?.profilePic?.url ? (
                                    <img src={user.profilePic.url} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.name || 'User'}</span>
                            <ChevronDown size={14} className={`text-gray-400 hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 animate-scaleIn z-50">
                                {/* User info */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>

                                <Link
                                    to="/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User size={15} className="text-gray-400" />
                                    My Profile
                                </Link>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Home size={15} className="text-gray-400" />
                                    Dashboard
                                </Link>

                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                    >
                                        <LogOut size={15} />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm animate-fadeIn"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
