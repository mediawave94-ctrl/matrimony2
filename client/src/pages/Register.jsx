import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: location.state?.name || '',
        mobile: location.state?.mobile || '',
        email: '',
        password: '',
        gender: 'male'
    });
    const [error, setError] = useState('');

    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                // Redirect to Onboarding (Questionnaire) after success
                navigate('/onboarding');
            } else {
                setError(data.msg || 'Registration failed.');
            }
        } catch (err) {
            setError('Server error.');
        }
    };

    return (
        <div className="min-h-screen  bg-brand-light-gold flex items-center justify-center p-4 selection:bg-brand-maroon/20">
            <div className="max-w-md w-full">
                    {/* <div className="text-center mb-10">
                        <Link to="/" className="inline-block">
                            <span className="text-4xl font-black tracking-tighter text-gray-900">Shishya <span className="text-brand-maroon">Matrimony</span></span>
                        </Link>
                    </div> */}

                <div className="bg-white  rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-brand-maroon py-4 px-6 text-center shadow-lg">
                        <h3 className="text-brand-gold font-bold text-xl">Create Account</h3>
                    </div>

                    <form className="p-8 space-y-5" onSubmit={handleSubmit}>
                        <div className="text-center mb-2">
                            <h4 className="text-gray-800 font-bold text-lg">Join Shishya Matrimony</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Mobile</label>
                                    <input
                                        name="mobile"
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        placeholder="Mobile Number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none bg-white transition-all duration-200"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-[13px] font-medium p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="pt-2 flex flex-col gap-4">
                            <Button 
                                type="submit" 
                                className="w-full bg-brand-maroon hover:bg-maroon/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-brand-maroon/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                CREATE ACCOUNT
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>

                            <div className="pt-4 border-t border-gray-50 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account? 
                                    <Link to="/login" className="text-brand-maroon font-bold hover:underline ml-1">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
