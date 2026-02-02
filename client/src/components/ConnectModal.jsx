import React, { useState } from 'react';
import Button from './ui/Button';

const ConnectModal = ({ isOpen, onClose, onSend, candidateName }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    if (!isOpen) return null;

    const handleSend = async () => {
        setSending(true);
        await onSend(message);
        setSending(false);
        setMessage('');
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-scale-in">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect with {candidateName}</h3>
                <p className="text-gray-500 mb-4 text-sm">
                    Send a short intro message to break the ice.
                </p>

                <textarea
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-32"
                    placeholder="Hi, I noticed we have similar interests in..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={200}
                />

                <div className="flex justify-end gap-2 text-xs text-gray-400 mb-4">
                    {message.length}/200
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <Button onClick={handleSend} disabled={!message.trim() || sending}>
                        {sending ? 'Sending...' : 'Send Request'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;
