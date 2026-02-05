import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConnectModal from '../components/ConnectModal';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('none'); // none, pending, accepted, rejected

    useEffect(() => {
        fetchUserProfile();
        fetchConnectionStatus();
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/users/${id}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                setError('User not found');
            }
        } catch (err) {
            console.error(err);
            setError('Error loading profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchConnectionStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/connections/status/${id}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setConnectionStatus(data.status || 'none');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleConnect = async (message) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/connections/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ recipientId: id, introMessage: message })
            });

            if (res.ok) {
                setConnectionStatus('pending');
                setIsConnectModalOpen(false);
                // Optionally refresh profile to see if anything changed (unlikely until accept)
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error || !user) return <div className="min-h-screen flex items-center justify-center">{error || 'User not found'}</div>;

    const DisplayRow = ({ label, value }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="font-medium text-gray-900 text-right">{value || '-'}</span>
        </div>
    );

    const isConnected = connectionStatus === 'accepted';
    const isLimited = !isConnected;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-rose-900">
                    &larr; Back
                </Button>

                {/* Header / Basic Identity */}
                <Card className="p-6 border-t-4 border-rose-900 shadow-xl overflow-hidden relative">
                    {/* Background Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50" />

                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-40 h-40 bg-gray-200 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl rotate-3 relative">
                            {user.basicDetails?.photoUrl ? (
                                <img
                                    src={user.basicDetails.photoUrl}
                                    alt="Profile"
                                    className={`w-full h-full object-cover transition-all duration-1000 ${connectionStatus !== 'accepted' ? 'blur-2xl scale-125' : ''}`}
                                />
                            ) : (
                                <span className="text-5xl text-gray-400 font-bold">{user.name?.charAt(0)}</span>
                            )}
                            {connectionStatus !== 'accepted' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white shadow-sm" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                                {user.astroMatch && (
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full shadow-sm">
                                        <span className="text-xs font-black text-amber-700 uppercase tracking-widest">
                                            {(user.astroMatch?.total || 0)}/10 Astro Match
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">
                                ID: {user._id.toString().slice(-6).toUpperCase()} • {user.basicDetails?.age || 'N/A'} YRS • {user.religious?.religion || ''}
                            </p>
                            {user.bio && (
                                <p className="mt-4 text-gray-600 leading-relaxed max-w-lg italic">
                                    <span className="text-rose-900 font-serif text-2xl leading-none">"</span>
                                    {user.bio}
                                    <span className="text-rose-900 font-serif text-2xl leading-none">"</span>
                                </p>
                            )}

                            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                                {connectionStatus === 'none' && (
                                    <Button onClick={() => setIsConnectModalOpen(true)} className="bg-rose-900 hover:bg-rose-950 text-amber-400 px-8 py-3 rounded-xl font-bold transition-all hover:-translate-y-1 shadow-lg shadow-rose-900/20">
                                        Send Interest
                                    </Button>
                                )}
                                {connectionStatus === 'pending' && (
                                    <Button disabled className="bg-amber-100 text-amber-700 border border-amber-200 px-8 py-3 rounded-xl font-bold">
                                        Waiting for Acceptance
                                    </Button>
                                )}
                                {connectionStatus === 'accepted' && (
                                    <Button variant="secondary" className="bg-green-100 text-green-700 border border-green-200 px-8 py-3 rounded-xl font-bold" onClick={() => navigate(`/messages?user=${user._id}`)}>
                                        Open Chat 💬
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Astrology Detailed Compatibility */}
                {user.astroMatch && (
                    <Card className="p-0 border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50/50 py-4 border-b border-gray-200 text-center">
                            <h3 className="text-xl font-bold text-gray-800">Wedding fit results</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 w-16">#</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400">Section</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.astroMatch.details.map((detail, idx) => (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                                                    {detail.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    {detail.status === 'Applicable' ? (
                                                        <>
                                                            <span className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full">
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-600">Applicable</span>
                                                        </>
                                                    ) : detail.status === 'Neutral' ? (
                                                        <>
                                                            <span className="flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full relative">
                                                                <div className="w-2.5 h-0.5 bg-white rounded-full"></div>
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-600">Neutral</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </span>
                                                            <span className="text-sm font-medium text-gray-600">Not applicable</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50/80 py-4 border-t border-gray-200 text-center">
                            <span className="text-lg font-bold text-gray-800">Total {(user.astroMatch?.total || 0)}/10</span>
                        </div>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">

                    {/* Basic Details */}
                    <Card className="p-6 border-l-4 border-rose-900">
                        <h3 className="text-lg font-bold text-rose-900 mb-4 pb-2 border-b border-rose-50">Profile Summary</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Date of Birth" value={user.basicDetails?.dob ? new Date(user.basicDetails.dob).toLocaleDateString() : ''} />
                            <DisplayRow label="Marital Status" value={user.basicDetails?.maritalStatus} />
                            <DisplayRow label="Height" value={user.basicDetails?.height ? `${user.basicDetails.height} cm` : ''} />
                            <DisplayRow label="Complexion" value={user.basicDetails?.complexion} />
                            <DisplayRow label="Religion" value={user.religious?.religion} />
                            <DisplayRow label="Caste" value={user.religious?.caste} />
                        </div>
                    </Card>

                    {/* Professional Details */}
                    <Card className="p-6 border-l-4 border-amber-400 text-gray-900">
                        <h3 className="text-lg font-bold text-rose-900 mb-4 pb-2 border-b border-rose-50">Career & Location</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Occupation" value={user.professional?.occupation} />
                            <DisplayRow label="Education" value={user.professional?.education} />
                            <DisplayRow label="Annual Income" value={user.professional?.annualIncome} />
                            <DisplayRow label="Current City" value={user.location?.city} />
                            <DisplayRow label="Residing State" value={user.location?.residingState} />
                        </div>
                    </Card>

                    {/* Detailed Religious Details */}
                    <Card className="p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-rose-900 mb-4 pb-2 border-b border-rose-50">Religious Profile</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Star (Natchathiram)" value={user.astrological?.natchathiram} />
                            <DisplayRow label="Moon Sign (Rassi)" value={user.astrological?.rassi} />
                            <DisplayRow label="Dosham" value={user.astrological?.dosham} />
                            <DisplayRow label="Sub Caste" value={user.religious?.subCaste} />
                            <DisplayRow label="Gothiram" value={user.religious?.gothiram} />
                        </div>
                    </Card>

                    {/* Family Details - PROTECTED */}
                    {isConnected ? (
                        <Card className="p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-rose-900 mb-4 pb-2 border-b border-rose-50">Family Background</h3>
                            <div className="space-y-1">
                                <DisplayRow label="Father" value={`${user.family?.fatherName || '-'} ${user.family?.fatherOccupation ? `(${user.family.fatherOccupation})` : ''}`} />
                                <DisplayRow label="Mother" value={`${user.family?.motherName || '-'} ${user.family?.motherOccupation ? `(${user.family.motherOccupation})` : ''}`} />
                                <DisplayRow label="Siblings" value={user.family?.siblings} />
                                <DisplayRow label="Family Type" value={user.family?.familyType} />
                                <DisplayRow label="Values" value={user.family?.familyValues} />
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6 bg-gray-50 flex items-center justify-center flex-col text-center opacity-75 border-dashed border-2 border-gray-200">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Locked Information</h3>
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-900/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500 font-medium px-8 leading-relaxed">Family heritage and contact details are available once the member accepts your interest.</p>
                        </Card>
                    )}
                </div>
            </div>

            <ConnectModal
                isOpen={isConnectModalOpen}
                onClose={() => setIsConnectModalOpen(false)}
                onSend={handleConnect}
                candidateName={user.name}
            />
        </div>
    );
};

export default UserProfile;
