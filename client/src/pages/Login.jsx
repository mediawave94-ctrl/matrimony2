import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirect if already logged in
    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on edit
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                // Redirect based on role
                if (data.user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.msg || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-brand-light-gold flex items-center justify-center p-4 selection:bg-brand-maroon/20">
            <div className="max-w-sm w-full">
                
                {/* <div className="text-center mb-10">
                    <Link to="/" className="inline-block">
                        <span className="text-4xl font-black tracking-tighter text-gray-900">Shishya <span className="text-brand-maroon">Matrimony</span></span>
                    </Link>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Match by Values, Not Just Photos</p>
                </div> */}

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-brand-maroon py-4 px-6 text-center shadow-lg">
                        <h3 className="text-brand-gold font-bold text-xl">Welcome Back</h3>
                    </div>

                    <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="text-center mb-2">
                            <h4 className="text-gray-900 font-black text-xl">Login to your account</h4>
                        </div>

                        <div className="space-y-4">
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
                                className="w-full bg-brand-maroon hover:bg-maroon/90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-brand-maroon/30 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                LOGIN
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Button>

                            <div className="pt-4 border-t border-gray-50 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account? 
                                    <Link to="/register" className="text-brand-maroon font-bold hover:underline ml-1">
                                        Register Now
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

export default Login;
