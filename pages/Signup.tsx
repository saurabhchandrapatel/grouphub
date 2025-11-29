import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      // Store user data
      login(data);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join GroupHub to discover amazing communities</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
            <input 
              type="text" 
              name="name"
              required
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              minLength={6}
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              minLength={6}
              className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;