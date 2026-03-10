import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = ({ isCompact = false }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Redirect if already logged in (only on full page)
    React.useEffect(() => {
        if (!isCompact && localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate, isCompact]);

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

    const content = (
        <div className={isCompact ? "" : "max-w-md w-full"}>
            {!isCompact && (
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Shisya Matrimony</h1>
                    <p className="text-gray-600">Find Your Perfect Soulmate</p>
                </div>
            )}

            <Card title={isCompact ? "Welcome Back" : "Sign In"}>
                {isCompact && (
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-black text-primary">Shisya</h2>
                        <p className="text-gray-500 text-sm">Match by Values, Not Just Photos</p>
                    </div>
                )}
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
                        <Button type="submit" className="w-full">
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
    );

    if (isCompact) return content;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {content}
        </div>
    );
};

export default Login;
