import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

const RegistrationHeroForm = () => {
    const [formData, setFormData] = useState({
        profileFor: '',
        name: '',
        mobile: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Redirect to full registration with these details or just to register page
        navigate('/register', { state: formData });
    };

    return (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-brand-maroon py-3 px-6 text-center">
                <h3 className="text-gold font-bold text-lg">Create a Matrimony Profile</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="text-center mb-4">
                    <h4 className="text-gray-800 font-semibold text-lg">Find your perfect match</h4>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <select
                            name="profileFor"
                            value={formData.profileFor}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none appearance-none bg-white text-gray-700"
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Wait, I'll use a simple icon" />
                                <path d="M19 9l-7 7-7-7" />
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none"
                            required
                        />
                    </div>

                    <div className="flex gap-2">
                        <select className="w-20 px-2 py-3 rounded-lg border border-gray-300 bg-gray-50 text-sm">
                            <option>+91</option>
                        </select>
                        <input
                            type="tel"
                            name="mobile"
                            placeholder="Enter Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-maroon focus:border-transparent outline-none"
                            required
                        />
                    </div>
                </div>

                <p className="text-[10px] text-gray-500 text-center leading-tight">
                    OTP will be sent to this number
                </p>

                <Button
                    type="submit"
                    className="w-full bg-brand-maroon hover:bg-maroon/90 text-gold font-bold py-4 rounded-lg flex items-center justify-center gap-2 group shadow-lg shadow-maroon/20"
                >
                    REGISTER FREE
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Button>

                <p className="text-[9px] text-gray-400 text-center">
                    *By clicking register free, I agree to the <span className="underline cursor-pointer">T&C</span> and <span className="underline cursor-pointer">Privacy Policy</span>
                </p>
            </form>
        </div>
    );
};

export default RegistrationHeroForm;
