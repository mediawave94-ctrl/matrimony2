import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const initialUserId = searchParams.get('user');

    const messagesEndRef = useRef(null);

    const fetchConversations = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/chat/conversations/all', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setConversations(data);

                // If initialUserId param exists, find and select that user
                if (initialUserId) {
                    const target = data.find(u => u._id === initialUserId);
                    if (target) setSelectedUser(target);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/chat/${userId}`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);

                // Mark messages as read
                await fetch(`/api/chat/mark-read/${userId}`, {
                    method: 'PUT',
                    headers: { 'x-auth-token': token }
                });

                // Refresh conversations list to update unread counts
                fetchConversations();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll for conversation updates
        return () => clearInterval(interval);
    }, []);

    // Load messages when selected user changes
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id);

            // Optimistically clear unread count for the selected user in the sidebar
            setConversations(prev => prev.map(conv =>
                conv._id === selectedUser._id ? { ...conv, unreadCount: 0 } : conv
            ));

            // Poll for new messages every 3s
            const interval = setInterval(() => fetchMessages(selectedUser._id), 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUser]);

    // Auto-scroll disabled as per user request
    /*
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, selectedUser]);
    */

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedUser) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/chat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ recipientId: selectedUser._id, text: input })
            });

            if (res.ok) {
                setInput('');
                fetchMessages(selectedUser._id); // Refresh immediately
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading chats...</div>;

    return (
        <div className="h-[calc(100vh-80px)] bg-gray-50 overflow-hidden flex flex-col">
            <div className="max-w-7xl mx-auto w-full bg-white shadow-xl flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Sidebar (Conversations List) */}
                <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">
                        Messages
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-gray-400">
                                <p>No connections yet.</p>
                                <p className="text-sm mt-2">Connect with profiles to start chatting!</p>
                            </div>
                        ) : (
                            conversations.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedUser?._id === user._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}
                                >
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden relative">
                                        {user.basicDetails?.photoUrl ? (
                                            <img src={user.basicDetails.photoUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                                                {user.name[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-800 truncate">{user.name}</h4>
                                            {user.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-2">
                                                    {user.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs truncate ${user.unreadCount > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                            {user.lastMessage ? user.lastMessage.text : 'No messages'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`w-full md:w-2/3 flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
                    {selectedUser ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shadow-sm z-10">
                                <button className="md:hidden text-gray-500" onClick={() => setSelectedUser(null)}>&larr;</button>
                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                    {selectedUser.basicDetails?.photoUrl ? (
                                        <img src={selectedUser.basicDetails.photoUrl} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                                            {selectedUser.name[0]}
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-800">{selectedUser.name}</h3>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-400 mt-10">
                                        <p>Say hello! 👋</p>
                                    </div>
                                )}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === selectedUser._id ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.sender === selectedUser._id
                                            ? 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                            : 'bg-blue-600 text-white rounded-tr-none'
                                            }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 p-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                    <Button type="submit" disabled={!input.trim()}>Send</Button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Messages;
