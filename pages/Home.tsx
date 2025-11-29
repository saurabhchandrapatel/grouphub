import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Group, Category } from '../types';
import { ArrowRight, Compass, Users, Zap, Search } from 'lucide-react';
import { api } from '../api';

const categories: { name: Category; image: string }[] = [
  { name: 'Technology', image: 'https://picsum.photos/id/1/400/300' },
  { name: 'Hobbies', image: 'https://picsum.photos/id/20/400/300' },
  { name: 'Local', image: 'https://picsum.photos/id/30/400/300' },
  { name: 'Education', image: 'https://picsum.photos/id/26/400/300' },
  { name: 'Sports', image: 'https://picsum.photos/id/73/400/300' },
  { name: 'Arts & Culture', image: 'https://picsum.photos/id/56/400/300' },
  { name: 'Health & Wellness', image: 'https://picsum.photos/id/65/400/300' },
  { name: 'Business', image: 'https://picsum.photos/id/3/400/300' },
];

const Home: React.FC = () => {
  const [recentGroups, setRecentGroups] = useState<Group[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentGroups = async () => {
      try {
        const groups = await api.getGroups();
        setRecentGroups(groups.slice(0, 3));
        setError(null);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        setError('Failed to load recent groups');
      }
    };
    fetchRecentGroups();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#1e1e1e] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Find Your <span className="text-blue-500">Community</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Discover and join social media groups tailored to your interests. Connect, share, and grow with like-minded people.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Search for categories like 'Gaming', 'Cooking' or 'Hiking'..." 
              className="w-full pl-14 pr-4 py-4 bg-[#2d2d2d] border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg shadow-xl"
            />
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2"><Users size={16}/> 10k+ Groups</span>
            <span className="flex items-center gap-2"><Zap size={16}/> Instant Join</span>
            <span className="flex items-center gap-2"><Compass size={16}/> Easy Discovery</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Discover by Category</h2>
            <p className="text-gray-400">Explore communities based on your passions</p>
          </div>
          <Link to="/explore" className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to={`/explore?category=${cat.name}`} className="group relative rounded-xl overflow-hidden aspect-[4/3] cursor-pointer">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured/Recent Groups */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-3xl font-bold text-white">Recently Added</h2>
           <Link to="/explore" className="px-4 py-2 rounded-lg bg-[#2d2d2d] text-white hover:bg-[#3d3d3d] transition-colors text-sm font-medium">View More</Link>
        </div>

        {error ? (
          <div className="text-center py-8 text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentGroups.map((group) => (
             <div key={group.id} className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all flex flex-col">
                <div className="flex p-6 gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-gray-700">
                    <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{group.name}</h3>
                    <p className="text-xs text-blue-400 mb-2 font-medium uppercase tracking-wider">{group.platform}</p>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{group.description}</p>
                  </div>
                </div>
                <div className="mt-auto p-4 bg-[#252525] border-t border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{group.members.toLocaleString()} members</span>
                  <div className="flex gap-2">
                    <Link to={`/groups/${group.id}`} className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                      View Group
                    </Link>
                    {group.link && (
                      <a 
                        href={group.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        Join
                      </a>
                    )}
                  </div>
                </div>
             </div>
            ))}
          </div>
        )}
      </section>
      
      {/* CTA */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-3xl p-12 text-center relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-3xl font-bold text-white mb-4">Have a community to share?</h2>
             <p className="text-gray-300 mb-8 max-w-xl mx-auto">Create your group profile today and reach thousands of like-minded individuals looking to connect.</p>
             <Link to="/create" className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/50 transition-all transform hover:scale-105">
               Create Your Group
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;