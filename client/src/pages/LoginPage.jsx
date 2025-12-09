import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { login } from '../services/authApi';// Import API call

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login: authLogin } = useAuthContext();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login({ email, password });
            
            // Assuming authApi returns user data and token
            authLogin(data.user, data.token); 
            navigate('/'); // Redirect to chat page
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-gray-900">Welcome Back</h2>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-md">{error}</div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email" type="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password" type="password" required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-150"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Need an account? <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;