import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import NotificationPanel from '../NotificationPanel';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('token');

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close notification panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isNotificationOpen && !event.target.closest('.notification-container')) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isNotificationOpen]);

    // Fetch notification count
    const fetchNotificationCount = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('/api/connections/requests', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setNotificationCount(data.length);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchNotificationCount();
            // Poll for updates every 3 seconds for "live" feel
            const interval = setInterval(fetchNotificationCount, 3000);
            return () => clearInterval(interval);
        }
    }, [location.pathname]); // Refetch on route change too

    // Listen for global updates
    useEffect(() => {
        const handleUpdate = () => fetchNotificationCount();
        window.addEventListener('notificationUpdate', handleUpdate);
        return () => window.removeEventListener('notificationUpdate', handleUpdate);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const toggleNotification = () => {
        if (!isNotificationOpen) {
            // Opening: Maybe reset count if we assume "seen" = "clicked icon"? 
            // The prompt says "if open numbers dissapper".
            setNotificationCount(0);
        }
        setIsNotificationOpen(!isNotificationOpen);
        setIsMobileMenuOpen(false);
    };

    const [unreadMessages, setUnreadMessages] = useState(0);

    const fetchUnreadCount = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('/api/chat/unread-total', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setUnreadMessages(data.count);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const UnreadBadge = () => {
        if (unreadMessages === 0) return null;
        return (
            <span className="absolute -top-1.5 -right-3 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 text-white text-[8px] font-bold flex items-center justify-center shadow-sm">
                {unreadMessages}
            </span>
        );
    };

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-[60] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-secondary shadow-xl group-hover:shadow-primary/30 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                                <span className="text-2xl">💍</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-serif font-black text-gray-900 tracking-tighter leading-none group-hover:text-primary transition-colors">
                                    Shisya
                                </span>
                                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-secondary leading-none mt-1">
                                    Matrimony
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-6">
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary font-bold text-sm tracking-wide transition-colors">
                                    DASHBOARD
                                </Link>

                                <Link to="/messages" className="relative group text-gray-600 hover:text-primary font-bold text-sm tracking-wide transition-colors">
                                    MESSAGES
                                    <UnreadBadge />
                                </Link>

                                <div className="relative notification-container">
                                    <button
                                        onClick={toggleNotification}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-300 relative group"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isNotificationOpen ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        {notificationCount > 0 && !isNotificationOpen && (
                                            <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce">
                                                {notificationCount}
                                            </span>
                                        )}
                                    </button>
                                    <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                                </div>

                                <div className="h-8 w-px bg-gray-200"></div>

                                <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-bold text-xs tracking-widest">
                                    LOGOUT
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button variant="ghost" className="text-gray-600 hover:text-primary font-bold">Sign In</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-primary hover:bg-primary-hover text-white shadow-xl shadow-primary/20 px-8 py-3 rounded-2xl font-bold">
                                        Join Now
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        {isAuthenticated && (
                            <div className="relative notification-container">
                                <button
                                    onClick={toggleNotification}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 relative"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {notificationCount > 0 && !isNotificationOpen && (
                                        <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                                    )}
                                </button>
                                <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
                            </div>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="flex justify-between items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                                        Dashboard
                                    </div>
                                </Link>
                                <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="flex justify-between items-center px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                                        Messages
                                        {unreadMessages > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {unreadMessages}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                                <div className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 cursor-pointer" onClick={handleLogout}>
                                    Sign Out
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                                        Login
                                    </div>
                                </Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="block px-3 py-3 rounded-md text-base font-medium text-primary hover:bg-primary/5">
                                        Register Free
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
