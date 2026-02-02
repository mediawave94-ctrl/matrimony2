import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const RequestsModal = ({ isOpen, onClose }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of request being processed

    if (!isOpen) return null;

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/connections/requests', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setActionLoading(id);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/connections/${action}/${id}`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                // Remove from list
                setRequests(prev => prev.filter(r => r._id !== id));
                // Optional: Trigger a global refresh? For now just UI update
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Connection Requests</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 pr-2">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No pending requests.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map(req => (
                                <div key={req._id} className="border border-gray-100 rounded-xl p-4 hover:border-primary/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center"
                                            style={{ backgroundImage: req.requester.basicDetails?.photoUrl ? `url(${req.requester.basicDetails.photoUrl})` : 'none' }}>
                                            {!req.requester.basicDetails?.photoUrl && (
                                                <span className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg">
                                                    {req.requester.name[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{req.requester.name}</h4>
                                                    <p className="text-xs text-gray-500">
                                                        {req.requester.basicDetails?.age || 'N/A'} • {req.requester.professional?.occupation || 'N/A'}
                                                    </p>
                                                </div>
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {req.introMessage && (
                                                <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-600 italic">
                                                    "{req.introMessage}"
                                                </div>
                                            )}

                                            <div className="mt-4 flex gap-3">
                                                <Button
                                                    className="flex-1 py-1.5 text-sm"
                                                    onClick={() => handleAction(req._id, 'accept')}
                                                    disabled={actionLoading === req._id}
                                                >
                                                    {actionLoading === req._id ? '...' : 'Accept'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 py-1.5 text-sm"
                                                    onClick={() => handleAction(req._id, 'reject')}
                                                    disabled={actionLoading === req._id}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestsModal;
