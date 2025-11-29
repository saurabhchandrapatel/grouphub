import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import GroupDetail from './pages/GroupDetail';
import Profile from './pages/Profile';
import CreateGroup from './pages/CreateGroup';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();



  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/create" element={<CreateGroup />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <footer className="bg-[#0a0a0a] border-t border-gray-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2024 GroupHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;