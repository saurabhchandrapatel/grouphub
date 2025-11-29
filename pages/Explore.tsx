import React, { useState, useEffect } from 'react';
import { Group } from '../types';
import { Search, Filter, SlidersHorizontal, Users, ArrowUpRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';

const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getGroups({
          search: searchTerm || undefined,
          category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
          platform: selectedPlatform !== 'All Platforms' ? selectedPlatform : undefined
        });
        setGroups(data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        setError('Failed to load groups. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [searchTerm, selectedPlatform, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Groups</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for groups, topics, or keywords..."
            className="w-full bg-[#1e1e1e] border border-gray-700 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1e1e1e] p-4 rounded-xl border border-gray-800">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             <div className="relative">
                <select 
                  className="appearance-none bg-[#2d2d2d] text-white px-4 py-2 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm font-medium cursor-pointer hover:bg-[#363636] transition-colors"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option>All Platforms</option>
                  <option>Discord</option>
                  <option>Telegram</option>
                  <option>WhatsApp</option>
                  <option>Facebook</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
             </div>

             <div className="relative">
                <select 
                  className="appearance-none bg-[#2d2d2d] text-white px-4 py-2 pr-10 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm font-medium cursor-pointer hover:bg-[#363636] transition-colors"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Hobbies</option>
                  <option>Business</option>
                  <option>Health & Wellness</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
             </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <div className="relative">
              <select className="appearance-none bg-[#2d2d2d] text-white px-4 py-2 pr-8 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm font-medium cursor-pointer">
                <option>Relevance</option>
                <option>Newest</option>
                <option>Most Members</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Search Results ({groups.length})</h2>
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : groups.length > 0 ? (
          groups.map(group => <GroupCard key={group.id} group={group} />)
        ) : (
          <EmptyState />
        )}
      </div>
    // amazonq-ignore-next-line
    </div>
  );
};

const LoadingState = () => (
  <div className="text-center py-20">
    <div className="text-gray-400">Loading groups...</div>
  </div>
);

const GroupCard: React.FC<{ group: Group }> = ({ group }) => (
  <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5 hover:border-gray-600 transition-colors group">
    <div className="w-16 h-16 rounded-xl bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-700">
      <img 
        src={group.image} 
        alt={group.name} 
        className="w-full h-full object-cover" 
        onError={(e) => {
          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${group.name}`;
        }}
      />
    </div>
    
    <div className="flex-grow min-w-0">
      <div className="flex items-center gap-3 mb-1">
        <h3 className="text-lg font-bold text-white truncate">{group.name || 'Unnamed Group'}</h3>
        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded border border-gray-700">{group.platform || 'Unknown'}</span>
      </div>
      <p className="text-gray-400 text-sm line-clamp-2 mb-2">{group.description || 'No description available'}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
         <span className="flex items-center gap-1"><Users size={12}/> {(group.members || 0).toLocaleString()} members</span>
         <span>•</span>
         <span>{group.category || 'Uncategorized'}</span>
      </div>
    </div>

    <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
      <div className="flex gap-2">
        <Link 
          to={`/groups/${group.id}`}
          className="flex-1 md:flex-none text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors border border-gray-600 hover:border-gray-500"
        >
          View
        </Link>
        {group.link && (
          <a 
            href={group.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 md:flex-none text-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            Join
          </a>
        )}
      </div>
    </div>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-gray-800">
    <div className="w-12 h-12 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-white font-bold">!</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">Error</h3>
    <p className="text-gray-400 mb-4">{message}</p>
    <button 
      onClick={onRetry}
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      Try Again
    </button>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-20 bg-[#1e1e1e] rounded-xl border border-gray-800 border-dashed">
    <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">No groups found</h3>
    <p className="text-gray-400">Try adjusting your filters or search terms.</p>
  </div>
);

export default Explore;