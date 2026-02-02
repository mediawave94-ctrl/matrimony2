import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import { useNavigate } from 'react-router-dom';

const NotificationPanel = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('new'); // 'new', 'history'
    const [requests, setRequests] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            fetchData();
            // Poll while panel is open to show live changes
            const interval = setInterval(fetchData, 3000);
            return () => clearInterval(interval);
        }
    }, [isOpen, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            if (activeTab === 'new') {
                const res = await fetch('/api/connections/requests', {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) setRequests(await res.json());
            } else {
                const res = await fetch('/api/connections/history', {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) setHistory(await res.json());
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
                // Move from requests to history (locally) or just refetch
                setRequests(prev => prev.filter(r => r._id !== id));
                // If we want to update history immediately, we could, but next tab switch will catch it.
            }
            // trigger global refresh if needed
            window.dispatchEvent(new Event('notificationUpdate'));
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-16 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
                <h3 className="font-bold text-gray-800 text-lg">Notifications</h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
                >
                    &times;
                </button>
            </div>

            <div className="flex border-b border-gray-100">
                <button
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'new' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('new')}
                >
                    New Requests
                </button>
                <button
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('history')}
                >
                    History
                </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2 bg-gray-50/50">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                ) : activeTab === 'new' ? (
                    requests.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                                <span className="text-xl">📭</span>
                            </div>
                            <p className="text-sm font-medium">No new requests</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map(req => (
                                <div key={req._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex gap-3">
                                        <div
                                            className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center border border-gray-100"
                                            style={{ backgroundImage: req.requester.basicDetails?.photoUrl ? `url(${req.requester.basicDetails.photoUrl})` : 'none' }}
                                        >
                                            {!req.requester.basicDetails?.photoUrl && (
                                                <span className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-sm">
                                                    {req.requester.name[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-sm font-bold text-gray-900 truncate">
                                                    {req.requester.name}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2 bg-gray-50 px-1.5 py-0.5 rounded">
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {req.introMessage && (
                                                <div className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded-lg mb-3 border border-gray-100">
                                                    "{req.introMessage}"
                                                </div>
                                            )}

                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    className="flex-1 py-1.5 text-xs h-8"
                                                    onClick={() => handleAction(req._id, 'accept')}
                                                    disabled={actionLoading === req._id}
                                                >
                                                    {actionLoading === req._id ? 'Processing...' : 'Accept'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 py-1.5 text-xs h-8 border-gray-200"
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
                    )
                ) : (
                    history.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <p className="text-sm">No history yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map(req => (
                                <div key={req._id} className="bg-white border border-gray-100 rounded-xl p-3 opacity-75 hover:opacity-100 transition-opacity">
                                    <div className="flex gap-3 items-center">
                                        <div
                                            className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 bg-cover bg-center grayscale"
                                            style={{ backgroundImage: req.requester.basicDetails?.photoUrl ? `url(${req.requester.basicDetails.photoUrl})` : 'none' }}
                                        >
                                            {!req.requester.basicDetails?.photoUrl && (
                                                <span className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                                                    {req.requester.name[0]}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{req.requester.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {req.status === 'accepted' ? 'You accepted this request' : 'You rejected this request'}
                                            </p>
                                        </div>
                                        <div>
                                            {req.status === 'accepted' ? (
                                                <span className="text-green-600 text-xs font-bold border border-green-200 bg-green-50 px-2 py-1 rounded-full">Accepted</span>
                                            ) : (
                                                <span className="text-red-500 text-xs font-bold border border-red-200 bg-red-50 px-2 py-1 rounded-full">Rejected</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default NotificationPanel;
