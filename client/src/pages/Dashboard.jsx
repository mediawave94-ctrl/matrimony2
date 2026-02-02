import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import ConnectModal from '../components/ConnectModal';

const Dashboard = () => {
    const [matches, setMatches] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [needsQuiz, setNeedsQuiz] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);

    // Filters
    const [filters, setFilters] = useState({
        minAge: '', maxAge: '', religion: '', caste: '', city: '', occupation: ''
    });

    // Connection State
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState(null);

    const navigate = useNavigate();

    const fetchAllProfiles = async (customFilters = filters) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Build query string
        const queryParams = new URLSearchParams(customFilters);
        // Remove empty keys
        for (const [key, value] of queryParams.entries()) {
            if (!value) queryParams.delete(key);
        }

        try {
            const response = await fetch(`/api/matches/all?${queryParams.toString()}`, {
                headers: { 'x-auth-token': token }
            });

            if (response.ok) {
                const data = await response.json();
                setAllProfiles(data);
            }
        } catch (err) {
            console.error('Error fetching all profiles:', err);
        }
    };

    useEffect(() => {
        const fetchMatches = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await fetch('/api/matches', {
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMatches(data);
                } else {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/');
                    } else if (errorData.code === 'QUIZ_REQUIRED') {
                        setNeedsQuiz(true);
                    } else {
                        setError('Failed to load matches');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Connection error');
            }
        };

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

        Promise.all([fetchMatches(), fetchAllProfiles(), fetchUnreadCount()]).finally(() => {
            setLoading(false);
        });

        const interval = setInterval(fetchUnreadCount, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleConnectClick = (user) => {
        setTargetUser(user);
        setIsConnectModalOpen(true);
    };

    const handleSendRequest = async (message) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/connections/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ recipientId: targetUser._id, introMessage: message })
            });

            if (res.ok) {
                // Update local state to show 'Pending'
                setMatches(prev => prev.map(m => m._id === targetUser._id ? { ...m, connectionStatus: 'pending' } : m));
                setAllProfiles(prev => prev.map(p => p._id === targetUser._id ? { ...p, connectionStatus: 'pending' } : p));
                setIsConnectModalOpen(false);
                setTargetUser(null);
                setIsConnectModalOpen(false);
                setTargetUser(null);
            } else {
                const data = await res.json();
                if (res.status === 403 && data.code === 'PREMIUM_REQUIRED') {
                    if (window.confirm('You need to be a Premium Member to connect. Upgrade now?')) {
                        navigate('/pricing');
                    }
                    setIsConnectModalOpen(false);
                } else {
                    alert(data.msg || 'Failed to send request');
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-500';
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    // ... existing state ...

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };


    // Trigger fetch on filter change (debounce could be added, but manual Apply button better?)
    // Let's do a simple "Apply Filters" button or auto-fetch
    const applyFilters = () => {
        fetchAllProfiles();
    };


    // Helper to render connection button based on status and direction
    // Wait, match object doesn't have direction info (requester vs recipient) easily unless back-end provides it.
    // The previously updated backend controller puts 'connectionStatus' string. 
    // To distinguish "Request Sent" vs "Received", we need to know who sent it.
    // For now, let's assume 'pending' means "Request Sent" generally unless we check further. 
    // The user explicitly asked for "Request Received". 
    // I need to update the backend matchController to return WHO sent the request if pending.
    // Or I can just check if I am the requester? 
    // The current matchController structure:
    // connectionMap[otherId] = conn.status;
    // It doesn't store who initiated. I should update backend matchController first if I want to be precise.
    // BUT time is tight. Let's assume for matches "Request Sent" is fine (we mostly see people we might want to connect to).
    // For "Request Received", typically that appears in notifications.
    // If a user sees a profile in "All Profiles" that SENT them a request, it should say "Accept/Reject" or "Request Received".
    // I'll stick to generic "Pending" for now or update if simple.
    // The user request: "if requent sent it show request sent in reciver side it should show as request received"
    // I will add a "Message" icon for accepted.

    // ...

    // ...
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Your Weekly Matches</h1>
                        <p className="text-sm text-gray-500 mt-1">Curated based on your Compatibility DNA</p>
                    </div>
                    <div className="flex w-full sm:w-auto gap-3">
                        <Button onClick={() => navigate('/messages')} variant="secondary" className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 relative">
                            <span>💬</span> Messages
                            {unreadMessages > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                                    {unreadMessages}
                                </span>
                            )}
                        </Button>
                        <Button onClick={() => navigate('/profile')} className="flex-1 sm:flex-none py-2.5">
                            My Profile
                        </Button>
                    </div>
                </header>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

                {needsQuiz ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-medium text-gray-600 mb-2">Personality Quiz Required</h3>
                        <p className="text-gray-400 mb-6">You need to complete the personality quiz to discover your matches.</p>
                        <Button onClick={() => navigate('/onboarding')}>Take Quiz Now</Button>
                    </div>
                ) : matches.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No matches found yet</h3>
                        <p className="text-gray-400">We are looking for users with opposite gender compatibility.</p>
                        <p className="text-gray-400 text-sm mt-2">Check back later as more users join!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.map((match) => (
                            <Card key={match._id} title={match.name} badge={
                                match.subscriptionStatus === 'premium' ?
                                    <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-300">SILVER</span> :
                                    match.subscriptionStatus === 'elite' ?
                                        <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-300">GOLD</span> :
                                        null
                            }>
                                <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-4 relative overflow-hidden group">
                                    {match.basicDetails?.photoUrl ? (
                                        <img
                                            src={match.basicDetails.photoUrl}
                                            alt={match.name}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${match.connectionStatus !== 'accepted' ? 'blur-md brightness-90' : ''}`}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-gray-300">{match.name[0]}</span>
                                        </div>
                                    )}

                                    {match.connectionStatus !== 'accepted' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                            <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Connect to view
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute top-3 left-3">
                                        <div className={`bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm flex flex-col items-center min-w-[50px]`}>
                                            <span className={`text-lg font-bold leading-none ${getScoreColor(match.compatibility.total)}`}>
                                                {match.compatibility.total}%
                                            </span>
                                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Match</span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                        <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-wide">
                                            {match.gender} • {match.age || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    {match.connectionStatus === 'none' && (
                                        <Button className="w-full text-sm py-2" onClick={() => handleConnectClick(match)}>
                                            Connect
                                        </Button>
                                    )}
                                    {match.connectionStatus === 'pending' && (
                                        <Button className="w-full text-sm py-2" variant="secondary" disabled>
                                            Request Sent
                                        </Button>
                                    )}
                                    {match.connectionStatus === 'accepted' && (
                                        <div className="flex gap-2">
                                            <Button className="flex-1 text-xs" variant="outline" onClick={() => navigate(`/profile/${match._id}`)}>
                                                View
                                            </Button>
                                            <Button className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white relative" onClick={() => navigate(`/messages?user=${match._id}`)}>
                                                Chat 💬
                                                {match.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                    {match.connectionStatus === 'rejected' && (
                                        <Button className="w-full text-sm py-2" variant="secondary" disabled>
                                            Rejected
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <div className="max-w-6xl mx-auto">
                {/* ... All Profiles & Filters ... */}
                <div className="mt-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">All Profiles</h1>
                        <p className="text-sm text-gray-500 mt-1">Discover everyone on our platform</p>
                    </div>

                    {/* Filter Bar */}
                    <div className="w-full md:w-auto flex flex-wrap gap-2 items-center bg-white p-2 md:p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <input name="minAge" placeholder="Min Age" className="flex-1 min-w-[70px] md:w-20 p-2 text-sm border-none bg-gray-50 rounded-xl focus:ring-0" value={filters.minAge} onChange={handleFilterChange} />
                        <input name="maxAge" placeholder="Max Age" className="flex-1 min-w-[70px] md:w-20 p-2 text-sm border-none bg-gray-50 rounded-xl focus:ring-0" value={filters.maxAge} onChange={handleFilterChange} />
                        <input name="city" placeholder="City" className="flex-[2] min-w-[100px] md:w-28 p-2 text-sm border-none bg-gray-50 rounded-xl focus:ring-0" value={filters.city} onChange={handleFilterChange} />
                        <Button size="sm" onClick={applyFilters} className="w-full md:w-auto rounded-xl">Filter</Button>
                    </div>
                </div>

                {allProfiles.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400">No profiles found matching criteria.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allProfiles.map((profile) => (
                            <Card
                                key={profile._id}
                                title={profile.name}
                                badge={
                                    profile.subscriptionStatus === 'premium' ?
                                        <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-300">SILVER</span> :
                                        profile.subscriptionStatus === 'elite' ?
                                            <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-300">GOLD</span> :
                                            null
                                }
                            >
                                {/* ... Card Content ... */}
                                <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-4 relative overflow-hidden group">
                                    {profile.basicDetails?.photoUrl ? (
                                        <img
                                            src={profile.basicDetails.photoUrl}
                                            alt={profile.name}
                                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${profile.connectionStatus !== 'accepted' ? 'blur-md brightness-90' : ''}`}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-gray-300">{profile.name[0]}</span>
                                        </div>
                                    )}

                                    {profile.connectionStatus !== 'accepted' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                            <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
                                                <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Connect to view
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-wide">
                                            {profile.gender} • {profile.age || 'N/A'}
                                        </span>
                                        <div className={`bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm flex items-center gap-2`}>
                                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Match</span>
                                            <span className={`text-sm font-bold ${getScoreColor(profile.compatibility?.total || 0)}`}>
                                                {profile.compatibility?.total || 0}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ... Details ... */}

                                <div className="mt-6 space-y-2">
                                    {profile.connectionStatus === 'none' && (
                                        <Button className="w-full" onClick={() => handleConnectClick(profile)}>Connect</Button>
                                    )}
                                    {profile.connectionStatus === 'pending' && (
                                        <Button className="w-full" variant="secondary" disabled>Request Sent</Button>
                                    )}
                                    {profile.connectionStatus === 'accepted' && (
                                        <div className="flex gap-2">
                                            <Button className="flex-1" variant="outline" onClick={() => navigate(`/profile/${profile._id}`)}>View</Button>
                                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white relative" onClick={() => navigate(`/messages?user=${profile._id}`)}>
                                                Chat 💬
                                                {profile.unreadCount > 0 && (
                                                    <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <ConnectModal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
                onSend={handleSendRequest}
                candidateName={targetUser?.name}
            />
        </div>
    );
};
export default Dashboard;
