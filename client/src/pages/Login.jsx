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
        <div className="min-h-screen bg-brand-light-gold flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-primary mb-2 tracking-tighter">Bondly<span className="text-secondary">.</span></h1>
                    <p className="text-gray-600 font-medium">Match by Values, Not Just Photos</p>
                </div>

                <Card title="Welcome Back">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        {error && <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">{error}</div>}

                        <div className="pt-2 flex flex-col gap-3">
                            <Button type="submit" variant="secondary" className="w-full">
                                Sign In
                            </Button>
                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?
                                <Link to="/register" className="text-primary font-medium hover:underline ml-1">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
