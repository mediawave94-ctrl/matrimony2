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
        <div className="min-h-screen bg-brand-light-gold flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-primary mb-2 tracking-tighter">Bondly<span className="text-secondary">.</span></h1>
                    <p className="text-gray-600 font-medium">Create your profile to get started</p>
                </div>

                <Card title="Create Account">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                        <Input label="Mobile Number" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" type="email" required />
                        <Input label="Password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" type="password" required />

                        {error && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{error}</div>}

                        <div className="pt-2">
                            <Button type="submit" variant="secondary" className="w-full">
                                Register
                            </Button>
                            <p className="text-center text-sm text-gray-600 mt-4">
                                Already have an account?
                                <Link to="/login" className="text-primary font-medium hover:underline ml-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Register;
