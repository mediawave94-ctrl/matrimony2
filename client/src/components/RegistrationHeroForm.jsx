import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from './ui/Button';

const RegistrationHeroForm = ({ isLogin, setIsLogin }) => {
    const [formData, setFormData] = useState({
        profileFor: '',
        name: '',
        mobile: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/register', { state: formData });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                if (data.user?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(data.msg || 'Login failed. Check your credentials.');
            }
        } catch (err) {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin);
        setError('');
    };

    return (
        <div className="w-full max-w-sm perspective-1000 min-h-[580px]">
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .card-face { position: absolute; width: 100%; height: 100%; top: 0; left: 0; }
            `}</style>
            
            <div className={`relative w-full h-full duration-700 preserve-3d ${isLogin ? 'rotate-y-180' : ''}`}>
                
                {/* ================= FRONT SIDE (REGISTER) ================= */}
                <div className="card-face backface-hidden bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
                    <div className="bg-brand-maroon py-4 px-6 text-center">
                        <h3 className="text-brand-gold font-black text-xl">Create a Matrimony Profile</h3>
                    </div>

                    <form onSubmit={handleRegister} className="p-8 flex-1 flex flex-col justify-between space-y-4">
                        <div className="text-center">
                            <h4 className="text-gray-900 font-extrabold text-xl">Find your perfect match</h4>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="relative">
                                <select
                                    name="profileFor"
                                    value={formData.profileFor}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none appearance-none bg-white text-gray-700 font-medium"
                                    required
                                >
                                    <option value="">Profile created for</option>
                                    <option value="myself">Myself</option>
                                    <option value="son">Son</option>
                                    <option value="daughter">Daughter</option>
                                    <option value="brother">Brother</option>
                                    <option value="sister">Sister</option>
                                    <option value="relative">Relative</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter the name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none font-medium"
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <select className="w-20 px-2 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold">
                                    <option>+91</option>
                                </select>
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Enter Mobile Number"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <p className="text-[11px] text-gray-400 text-center leading-tight pt-2">
                            OTP will be sent to this number
                        </p>

                        <div className="space-y-4 pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-brand-maroon hover:bg-maroon/90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 group shadow-xl shadow-brand-maroon/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                REGISTER FREE
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Button>

                            <div className="text-center py-2">
                                <p className="text-sm text-gray-600 font-medium">
                                    Already a member? 
                                    <button onClick={toggleMode} className="text-brand-maroon font-black hover:underline ml-1">
                                        Login Now
                                    </button>
                                </p>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center px-4">
                                *By clicking register free, I agree to the <span className="underline cursor-pointer">T&C</span> and <span className="underline cursor-pointer">Privacy Policy</span>
                            </p>
                        </div>
                    </form>
                </div>

                {/* ================= BACK SIDE (LOGIN) ================= */}
                <div className="card-face backface-hidden bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col rotate-y-180">
                    <div className="bg-brand-maroon py-4 px-6 text-center">
                        <h3 className="text-brand-gold font-black text-xl">Welcome Back</h3>
                    </div>

                    <form onSubmit={handleLogin} className="p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="text-center">
                            <h4 className="text-gray-900 font-extrabold text-xl">Login to your account</h4>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none font-medium text-gray-800"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                    <span className="text-[10px] font-bold text-brand-maroon hover:underline cursor-pointer">Forgot?</span>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none font-medium text-gray-800"
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

                        <div className="space-y-4 pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-maroon hover:bg-maroon/90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 group shadow-xl shadow-brand-maroon/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                            >
                                {loading ? 'SIGNING IN...' : 'LOGIN'}
                                {!loading && (
                                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                )}
                            </Button>

                            <div className="text-center py-2">
                                <p className="text-sm text-gray-600 font-medium">
                                    Don't have an account? 
                                    <button onClick={toggleMode} className="text-brand-maroon font-black hover:underline ml-1">
                                        Register FREE
                                    </button>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegistrationHeroForm;
