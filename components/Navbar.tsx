import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { Search, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {}

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center transform group-hover:rotate-12 transition-transform">
      <div className="w-4 h-4 bg-white rounded-sm opacity-80" />
    </div>
    <span className="text-xl font-bold tracking-tight text-white">GroupHub</span>
  </Link>
);

const DesktopNav = ({ isActive }: { isActive: (path: string) => string }) => (
  <div className="hidden md:flex items-center gap-6">
    <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/')}`}>Home</Link>
    <Link to="/explore" className={`text-sm font-medium transition-colors ${isActive('/explore')}`}>Explore</Link>
    <Link to="/profile" className={`text-sm font-medium transition-colors ${isActive('/profile')}`}>My Groups</Link>
  </div>
);

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}) => (
  <form onSubmit={handleSearch} className="relative w-full max-w-md">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
    <input
      type="text"
      placeholder="Search groups..."
      className="w-full bg-gray-800/50 border border-gray-700 text-gray-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </form>
);

const UserActions = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
          Log In
        </Link>
        <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Sign Up
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
        Create Group
      </Link>
      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#121212]" />
      </button>
      <div className="relative group">
        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} className="w-9 h-9 rounded-full border-2 border-gray-700 hover:border-gray-500 transition-colors object-cover cursor-pointer" />
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-t-lg">
            Profile
          </Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-b-lg">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const Navbar: React.FC<NavbarProps> = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path: string) => location.pathname === path ? 'text-white' : 'text-gray-400 hover:text-white';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-[#121212] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <DesktopNav isActive={isActive} />
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-end max-w-2xl ml-8">
            {user && <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />}
            <UserActions />
          </div>

          <button className="md:hidden text-gray-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMenuOpen && <MobileMenu onClose={() => setIsMenuOpen(false)} />}
    </nav>
  );
};

const MobileMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const menuItems = [
    { to: '/', label: 'Home', className: 'block text-gray-300 hover:text-white' },
    { to: '/explore', label: 'Explore', className: 'block text-gray-300 hover:text-white' },
    { to: '/profile', label: 'My Groups', className: 'block text-gray-300 hover:text-white' },
    { to: '/create', label: 'Create Group', className: 'block text-blue-400 font-medium' }
  ];

  return (
    <div className="md:hidden bg-[#1e1e1e] border-b border-gray-800 p-4 space-y-4">
      {menuItems.map(({ to, label, className }) => (
        <Link key={to} to={to} className={className} onClick={onClose}>
          {label}
        </Link>
      ))}
    </div>
  );
};

export default Navbar;