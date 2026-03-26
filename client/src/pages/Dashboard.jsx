import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ConnectModal from '../components/ConnectModal';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [matches, setMatches] = useState([]);
    const [allProfiles, setAllProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [needsQuiz, setNeedsQuiz] = useState(false);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        ageRange: '', religion: '', city: '', occupation: '', caste: ''
    });

    // Connection State
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState(null);

    const navigate = useNavigate();

    // -- Options --
    const AGE_OPTIONS = [
        { value: '18-25', label: '18 - 25' },
        { value: '26-30', label: '26 - 30' },
        { value: '31-35', label: '31 - 35' },
        { value: '36-40', label: '36 - 40' },
        { value: '41-50', label: '41 - 50' },
        { value: '50+', label: '50+' }
    ];

    const RELIGION_OPTIONS = ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Jain'];
    const PROFESSION_OPTIONS = ['Private', 'Government', 'Business', 'Self Employed'];
    const LOCATION_OPTIONS = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 'Thoothukudi', 'Thanjavur'];

    const fetchAllProfiles = async (customFilters = filters) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const queryParams = new URLSearchParams();
        if (customFilters.religion) queryParams.append('religion', customFilters.religion);
        if (customFilters.city) queryParams.append('city', customFilters.city);
        if (customFilters.occupation) queryParams.append('occupation', customFilters.occupation);
        
        // Handle age range
        if (customFilters.ageRange) {
            const [min, max] = customFilters.ageRange.replace('+', '-100').split('-');
            queryParams.append('minAge', min);
            queryParams.append('maxAge', max);
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
            console.error('Error fetching profiles:', err);
        }
    };

    const fetchMatches = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }
        try {
            const response = await fetch('/api/matches', { headers: { 'x-auth-token': token } });
            if (response.ok) {
                const data = await response.json();
                setMatches(data);
            } else {
                const errorData = await response.json();
                if (errorData.code === 'QUIZ_REQUIRED') setNeedsQuiz(true);
            }
        } catch (err) { console.error(err); }
    };

    const fetchUnreadCount = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('/api/chat/unread-total', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                setUnreadMessages(data.count);
            }
        } catch (err) { console.error(err); }
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch('/api/users/profile', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        Promise.all([fetchMatches(), fetchAllProfiles(), fetchUnreadCount(), fetchCurrentUser()]).finally(() => {
            setLoading(false);
        });
        const interval = setInterval(fetchUnreadCount, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleFilterChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        fetchAllProfiles(newFilters);
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
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ recipientId: targetUser._id, introMessage: message })
            });

            if (res.ok) {
                toast.success('Interest sent successfully!');
                setMatches(prev => prev.map(m => m._id === targetUser._id ? { ...m, connectionStatus: 'pending' } : m));
                setAllProfiles(prev => prev.map(p => p._id === targetUser._id ? { ...p, connectionStatus: 'pending' } : p));
                setIsConnectModalOpen(false);
            } else {
                const data = await res.json();
                toast.error(data.msg || 'Failed to send request');
            }
        } catch (err) { console.error(err); }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-rose-600';
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F46F4C]"></div>
        </div>
    );

    const calculateCompleteness = (u) => {
        if (!u) return 0;
        let w = 0; let m = 5;
        if (u.basicDetails?.photoUrl) w++;
        if (u.religious?.religion) w++;
        if (u.professional?.occupation) w++;
        if (u.location?.city) w++;
        if (u.family?.fatherName) w++;
        return Math.round((w / m) * 100);
    };

    const profilePercent = calculateCompleteness(currentUser);

    const ProfileCard = ({ p, isMatch = false }) => (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group p-4">
            <div className="aspect-[4/3] rounded-2xl relative overflow-hidden mb-4">
                {p.basicDetails?.photoUrl ? (
                    <img 
                        src={p.basicDetails.photoUrl} 
                        alt={p.name} 
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${p.connectionStatus !== 'accepted' ? 'blur-md brightness-90' : ''}`}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-3xl font-black text-gray-200">{p.name[0]}</div>
                )}
                
                {p.connectionStatus !== 'accepted' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                        <div className="bg-white/90 px-3 py-1.5 rounded-full shadow-lg border border-white/50">
                            <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                                🔒 Request View
                            </span>
                        </div>
                    </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                        <span className={`text-sm font-black ${getScoreColor(p.compatibility?.total || 75)}`}>
                            {p.compatibility?.total || 75}%
                        </span>
                        <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest">DNA</span>
                    </div>
                </div>

                <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-black text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg uppercase tracking-widest">
                        {p.age || 'N/A'} Yrs • {p.gender}
                    </span>
                </div>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 leading-tight capitalize">{p.name}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.professional?.occupation || 'Profession'} • {p.location?.city || 'Location'}</p>
            </div>

            <div className="mt-5 flex gap-2">
                <Button 
                    className="flex-1 text-xs py-3 rounded-xl border-2 border-[#F46F4C]/10 text-[#F46F4C] hover:bg-[#F46F4C]/5 transition-colors font-bold" 
                    variant="ghost" 
                    onClick={() => navigate(`/profile/${p._id}`)}
                >
                    Profile
                </Button>
                
                {p.connectionStatus === 'none' && (
                    <Button 
                        className="flex-[2] text-xs py-3 rounded-xl bg-[#F46F4C] hover:bg-[#e05e3b] shadow-lg shadow-orange-50 font-bold" 
                        onClick={() => handleConnectClick(p)}
                    >
                        Send Interest
                    </Button>
                )}
                {p.connectionStatus === 'pending' && (
                    <Button 
                        className="flex-[2] text-xs py-3 rounded-xl bg-gray-100 text-gray-400 font-bold" 
                        disabled
                    >
                        Interest Sent
                    </Button>
                )}
                {p.connectionStatus === 'accepted' && (
                    <Button 
                        className="flex-[1.5] text-xs py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold" 
                        onClick={() => navigate(`/messages?user=${p._id}`)}
                    >
                        Chat 💬
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex">
            {/* ================= MAIN CONTENT ================= */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-12">
                    
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Match Center</h1>
                            <p className="text-gray-400 font-bold mt-1 tracking-wide uppercase text-[10px] tracking-[0.2em]">Curated souls based on your soul profile</p>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{profilePercent}% Complete</p>
                                <div className="w-28 bg-gray-100 h-1 rounded-full overflow-hidden">
                                    <div className="bg-[#F46F4C] h-full transition-all duration-1000" style={{ width: `${profilePercent}%` }}></div>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/profile')} 
                                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-[#F46F4C]/10 shadow-sm hover:shadow-md hover:bg-[#FFF5F0] transition-all group"
                            >
                                <div className="w-8 h-8 rounded-xl bg-[#F46F4C]/10 flex items-center justify-center text-[#F46F4C] font-black text-sm group-hover:bg-[#F46F4C] group-hover:text-white transition-colors capitalize">
                                    {currentUser?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-xs font-black text-gray-700 uppercase tracking-widest hidden lg:block capitalize">My Profile</span>
                            </button>
                        </div>
                    </header>

                    {/* Weekly Matches */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-[#F46F4C]"></span>
                                Exclusive Matches For Interest
                            </h2>
                        </div>
                        {matches.length === 0 ? (
                            <div className="bg-white p-12 rounded-[3rem] border border-gray-100 text-center space-y-4">
                                <p className="text-gray-400 font-bold">Discovering new compatible souls...</p>
                                <Button onClick={() => navigate('/onboarding')} className="text-xs px-8">Refresh DNA Quiz</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {matches.slice(0, 3).map(m => <ProfileCard key={m._id} p={m} isMatch />)}
                            </div>
                        )}
                    </div>

                    {/* All Profiles */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-[#F46F4C]"></span>
                                All Profiles
                            </h2>
                            <p className="text-xs font-bold text-gray-400">{allProfiles.length} Members Found</p>
                        </div>
                        {allProfiles.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-400 font-bold">No souls match your current filters.</p>
                                <button onClick={() => { setFilters({ ageRange:'', religion:'', city:'', occupation:'', caste:'' }); fetchAllProfiles({ ageRange:'', religion:'', city:'', occupation:'', caste:'' }); }} className="text-[#F46F4C] font-black text-xs uppercase tracking-widest mt-4">Reset All Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allProfiles.map(p => <ProfileCard key={p._id} p={p} />)}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ================= RIGHT FILTERS SIDEBAR ================= */}
            <aside className="w-80 bg-white border-l border-gray-100 flex flex-col sticky top-20 h-[calc(100vh-80px)] shrink-0 p-8 hidden xl:flex">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Filters</h3>
                    <button 
                        onClick={() => { setFilters({ ageRange:'', religion:'', city:'', occupation:'', caste:'' }); fetchAllProfiles({ ageRange:'', religion:'', city:'', occupation:'', caste:'' }); }}
                        className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Clear
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Age Filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Age Range</label>
                        <select 
                            name="ageRange"
                            value={filters.ageRange}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 font-bold text-gray-800 text-sm focus:ring-2 focus:ring-[#F46F4C] appearance-none cursor-pointer"
                        >
                            <option value="">All Ages</option>
                            {AGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>

                    {/* Religion Filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Religion</label>
                        <select 
                            name="religion"
                            value={filters.religion}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 font-bold text-gray-800 text-sm focus:ring-2 focus:ring-[#F46F4C] appearance-none cursor-pointer"
                        >
                            <option value="">All Religions</option>
                            {RELIGION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Professional Filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional</label>
                        <select 
                            name="occupation"
                            value={filters.occupation}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 font-bold text-gray-800 text-sm focus:ring-2 focus:ring-[#F46F4C] appearance-none cursor-pointer"
                        >
                            <option value="">All Careers</option>
                            {PROFESSION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</label>
                        <select 
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                            className="w-full bg-gray-50 border-0 rounded-2xl px-5 py-4 font-bold text-gray-800 text-sm focus:ring-2 focus:ring-[#F46F4C] appearance-none cursor-pointer"
                        >
                            <option value="">All Regions</option>
                            {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>

                <div className="mt-auto p-6 bg-[#FFF5F0] rounded-3xl border border-orange-50 space-y-2">
                    <p className="text-[10px] font-black text-[#F46F4C] uppercase tracking-[0.2em]">Premium Filter</p>
                    <p className="text-[11px] font-bold text-gray-600 leading-relaxed">Upgrade to see members matching your DNA perfectly.</p>
                    <Button onClick={() => navigate('/pricing')} className="w-full text-[10px] py-3 mt-2 bg-white text-[#F46F4C] border border-[#F46F4C]/20 shadow-none hover:bg-white hover:shadow-lg">Learn More</Button>
                </div>
            </aside>

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
