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

                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                    &larr; Back
                </Button>

                {/* Header / Basic Identity */}
                <Card className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                            {user.basicDetails?.photoUrl ? (
                                <img
                                    src={user.basicDetails.photoUrl}
                                    alt="Profile"
                                    className={`w-full h-full object-cover transition-all duration-700 ${connectionStatus !== 'accepted' ? 'blur-xl scale-110' : ''}`}
                                />
                            ) : (
                                <span className="text-4xl text-gray-400 font-bold">{user.name?.charAt(0)}</span>
                            )}
                            {connectionStatus !== 'accepted' && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="text-center md:text-left flex-grow">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-500">
                                {user.basicDetails?.age || 'N/A'} • {user.professional?.occupation || 'N/A'} • {user.religious?.religion || ''}
                            </p>
                            {user.bio && (
                                <p className="mt-3 text-gray-600 italic">"{user.bio}"</p>
                            )}

                            <div className="mt-4">
                                {isLimited && (
                                    <div className="bg-yellow-50 text-yellow-800 text-sm px-4 py-2 rounded-lg mb-4 inline-block">
                                        Some details are hidden until you connect.
                                    </div>
                                )}
                            </div>

                            <div className="mt-2 flex gap-3 justify-center md:justify-start">
                                {connectionStatus === 'none' && (
                                    <Button onClick={() => setIsConnectModalOpen(true)}>Connect</Button>
                                )}
                                {connectionStatus === 'pending' && (
                                    <Button disabled variant="secondary">Request Sent</Button>
                                )}
                                {connectionStatus === 'accepted' && (
                                    <Button variant="outline">Connected</Button>
                                )}
                                {connectionStatus === 'rejected' && (
                                    <Button disabled variant="secondary">Request Rejected</Button>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Basic Details */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Basic Details</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Date of Birth" value={user.basicDetails?.dob ? new Date(user.basicDetails.dob).toLocaleDateString() : ''} />
                            <DisplayRow label="Marital Status" value={user.basicDetails?.maritalStatus} />
                            <DisplayRow label="Physical Status" value={user.basicDetails?.physicalStatus} />
                            <DisplayRow label="Height" value={user.basicDetails?.height ? `${user.basicDetails.height} cm` : ''} />
                            <DisplayRow label="Weight" value={user.basicDetails?.weight ? `${user.basicDetails.weight} kg` : ''} />
                            <DisplayRow label="Body Type" value={user.basicDetails?.bodyType} />
                            <DisplayRow label="Complexion" value={user.basicDetails?.complexion} />
                        </div>
                    </Card>

                    {/* Religious Details */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Religious Details</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Religion" value={user.religious?.religion} />
                            <DisplayRow label="Caste" value={user.religious?.caste} />
                            <DisplayRow label="Sub Caste" value={user.religious?.subCaste} />
                            <DisplayRow label="Gothiram" value={user.religious?.gothiram} />
                            <DisplayRow label="Kulam" value={user.religious?.kulam} />
                            <DisplayRow label="Kulladheivam" value={user.religious?.kulladheivam} />
                        </div>
                    </Card>

                    {/* Professional Details */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Professional Details</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Education" value={user.professional?.education} />
                            <DisplayRow label="Edu. Details" value={user.professional?.educationDetails} />
                            <DisplayRow label="Occupation" value={user.professional?.occupation} />
                            <DisplayRow label="Occ. Details" value={user.professional?.occupationDetails} />
                            <DisplayRow label="Employed In" value={user.professional?.employedIn} />
                            <DisplayRow label="Annual Income" value={user.professional?.annualIncome} />
                        </div>
                    </Card>

                    {/* Location Details */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Location Details</h3>
                        <div className="space-y-1">
                            <DisplayRow label="Country" value={user.location?.country} />
                            <DisplayRow label="State" value={user.location?.state} />
                            <DisplayRow label="City" value={user.location?.city} />
                            <DisplayRow label="Citizenship" value={user.location?.citizenship} />
                            <DisplayRow label="Residing State" value={user.location?.residingState} />
                        </div>
                    </Card>

                    {/* Family Details - PROTECTED */}
                    {isConnected ? (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Family Details</h3>
                            <div className="space-y-1">
                                <DisplayRow label="Father" value={`${user.family?.fatherName || ''} ${user.family?.fatherOccupation ? `(${user.family.fatherOccupation})` : ''}`} />
                                <DisplayRow label="Mother" value={`${user.family?.motherName || ''} ${user.family?.motherOccupation ? `(${user.family.motherOccupation})` : ''}`} />
                                <DisplayRow label="Siblings" value={user.family?.siblings} />
                                <DisplayRow label="Status" value={user.family?.familyStatus} />
                                <DisplayRow label="Type" value={user.family?.familyType} />
                                <DisplayRow label="About Family" value={user.family?.aboutFamily} />
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6 bg-gray-50 flex items-center justify-center flex-col text-center opacity-75">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Family Details</h3>
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">Connect to view detailed family information.</p>
                        </Card>
                    )}

                    {/* Astrological Details - PROTECTED */}
                    {isConnected ? (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Astrological Details</h3>
                            <div className="space-y-1">
                                <DisplayRow label="Rassi" value={user.astrological?.rassi} />
                                <DisplayRow label="Natchathiram" value={user.astrological?.natchathiram} />
                                <DisplayRow label="Dosham" value={user.astrological?.dosham} />
                                <DisplayRow label="Jathagam" value={user.astrological?.jathagamUrl ? 'View' : 'Not Uploaded'} />
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6 bg-gray-50 flex items-center justify-center flex-col text-center opacity-75">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Astrological Details</h3>
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">Connect to view astrological details.</p>
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
