import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import GroupDetail from './pages/GroupDetail';
import Profile from './pages/Profile';
import CreateGroup from './pages/CreateGroup';
import Login from './pages/Login';
import { User } from './types';
import { api } from './api';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.getUser('u1');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load user data';
        setError(errorMessage);
      }
    };
    fetchUser();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sans">
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/groups/:id" element={<GroupDetail />} />
            <Route path="/create" element={<CreateGroup />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <footer className="bg-[#0a0a0a] border-t border-gray-800 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-500">
            <p>&copy; 2024 GroupHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;