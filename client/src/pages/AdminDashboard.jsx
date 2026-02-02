import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('stats'); // stats, users
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Fetch Stats
                const statsRes = await fetch('/api/admin/stats', {
                    headers: { 'x-auth-token': token }
                });

                if (statsRes.status === 403) {
                    alert('Access Denied');
                    navigate('/dashboard');
                    return;
                }

                if (statsRes.ok) {
                    setStats(await statsRes.json());
                }

                // Fetch Users
                const usersRes = await fetch('/api/admin/users', {
                    headers: { 'x-auth-token': token }
                });
                if (usersRes.ok) {
                    setUsers(await usersRes.json());
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
                // Recalculate stats lightly or refetch
                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleGrantPremium = async (id) => {
        if (!window.confirm('Grant Free Premium to this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/admin/pay-manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ userId: id, amount: 0 })
            });

            if (res.ok) {
                alert('Premium granted!');
                // Update local user status
                setUsers(users.map(u => u._id === id ? { ...u, subscriptionStatus: 'premium' } : u));
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage users and monitor platform activity</p>
                </div>
                <Button variant="outline" onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/');
                }}>Logout</Button>
            </header>

            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'stats' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Overview
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('users')}
                >
                    User Management
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'reports' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Reports
                </button>
            </div>

            {activeTab === 'stats' && stats && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Premium Users</h3>
                            <p className="text-3xl font-bold text-secondary mt-2">{stats.premiumUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Active Connections</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalConnections}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium uppercase">Total Revenue</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-4">Recent Registrations</h3>
                        <div className="space-y-4">
                            {stats.recentUsers.map(u => (
                                <div key={u._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
                                        {u.name[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{u.name}</h4>
                                        <p className="text-sm text-gray-500">{u.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">User</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Joined</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.subscriptionStatus === 'premium' ? (
                                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">Premium</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">Free</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {user.subscriptionStatus !== 'premium' && (
                                                <button
                                                    onClick={() => handleGrantPremium(user._id)}
                                                    className="text-secondary hover:text-secondary-hover text-sm font-medium underline"
                                                >
                                                    Grant Premium
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-xl font-bold text-gray-900">Advanced Reports</h3>
                    <p className="text-gray-500 mt-2">Detailed revenue analytics and engagement metrics coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
