import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Pricing = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Mock Payment Handler
    const handleSubscribe = async (plan) => {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // In a real app, this would open Razorpay/Stripe
            // Here we simulate a successful payment callback
            // We'll call a special endpoint or just wait for "admin" approval simulation
            // For MVP: Let's create a transaction record and auto-upgrade (Self-serve demo)

            // Note: I'm reusing the admin manual pay endpoint for demo purposes 
            // OR finding a new way. Let's make a clear /api/payments/subscribe endpoint

            const res = await fetch('/api/users/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ planId: plan, amount: 999 })
            });

            if (res.ok) {
                alert('Payment Successful! You are now a Premium Member.');
                navigate('/dashboard');
            } else {
                alert('Payment failed. Please try again.');
            }

        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold text-primary mb-4">Choose Your Plan</h1>
                <p className="text-xl text-gray-600">Invest in your future happiness.</p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Free Plan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                    <p className="text-gray-500 mb-6">For getting started</p>
                    <div className="text-4xl font-bold text-gray-900 mb-8">₹0<span className="text-base font-normal text-gray-500">/month</span></div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span> Create Profile
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span> Browse Matches
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <span className="text-gray-300">✕</span> Send Connection Requests
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <span className="text-gray-300">✕</span> View Contact Details
                        </li>
                    </ul>

                    <Button variant="outline" className="w-full py-4 text-lg" disabled>Current Plan</Button>
                </div>

                {/* Premium Plan */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-secondary p-8 flex flex-col relative transform md:-translate-y-4">
                    <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                    <h3 className="text-2xl font-bold text-primary mb-2">Premium</h3>
                    <p className="text-gray-500 mb-6">For serious seekers</p>
                    <div className="text-4xl font-bold text-primary mb-8">₹999<span className="text-base font-normal text-gray-500">/month</span></div>

                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span> Create Detailed Profile
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span> Unlimited Browsing
                        </li>
                        <li className="flex items-center gap-3 font-medium">
                            <span className="text-green-500">✓</span> Unlimited Connection Requests
                        </li>
                        <li className="flex items-center gap-3 font-medium">
                            <span className="text-green-500">✓</span> View Contact Details (After Accept)
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-green-500">✓</span> Priority Support
                        </li>
                    </ul>

                    <Button
                        onClick={() => handleSubscribe('premium_monthly')}
                        className="w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Upgrade Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
