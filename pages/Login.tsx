import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
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
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store user data
      login(data);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = "min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4";
  const cardClasses = "w-full max-w-md bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8 shadow-2xl";

  return (
    <div className={containerClasses}>
      <div className={cardClasses}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Enter your credentials to access your account</p>
        </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/20 border border-red-900/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex justify-between items-center mb-2">
                   <label className="block text-gray-300 text-sm font-medium">Password</label>
                   <a href="#" className="text-sm text-blue-500 hover:text-blue-400">Forgot?</a>
                </div>
                <input 
                   type="password" 
                   name="password"
                   required
                   className="w-full bg-[#121212] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                   placeholder="••••••••"
                />
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 rounded-lg transition-colors"
             >
                {loading ? 'Logging in...' : 'Log In'}
             </button>

             <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-[#1e1e1e] text-gray-500">Or continue with</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 bg-[#2d2d2d] hover:bg-[#363636] text-white py-2.5 rounded-lg transition-colors border border-gray-700">
                   <span>Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 bg-[#2d2d2d] hover:bg-[#363636] text-white py-2.5 rounded-lg transition-colors border border-gray-700">
                   <span>GitHub</span>
                </button>
             </div>
          </form>

          <p className="text-center mt-8 text-gray-400 text-sm">
             Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium">Sign up</Link>
          </p>
       </div>
    </div>
  );
};

export default Login;