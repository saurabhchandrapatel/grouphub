import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Group } from '../types';
import { Users, Calendar, Hash, ShieldCheck, ExternalLink, Share2, MoreHorizontal } from 'lucide-react';
import { api } from '../api';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [relatedGroups, setRelatedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return;
      try {
        const [groupData, allGroups] = await Promise.all([
          api.getGroup(id),
          api.getGroups()
        ]);
        setGroup(groupData);
        setRelatedGroups(allGroups.filter(g => g.id !== id && g.category === groupData.category).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch group:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load group';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!group) {
    return <div className="text-center py-20">Group not found</div>;
  }

  return (
    <div className="pb-12">
       {/* Breadcrumb */}
       <div className="container mx-auto px-4 py-4 text-sm text-gray-500 flex items-center gap-2">
         <Link to="/explore" className="hover:text-white">Groups</Link>
         <span>/</span>
         <span className="text-white">{group.name}</span>
       </div>

      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
           {/* Header Card */}
           <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-900 to-gray-900 relative">
                 <div className="absolute inset-0 bg-black/20" />
              </div>
              <div className="px-8 pb-8 relative">
                 <div className="flex justify-between items-end -mt-10 mb-6">
                    <div className="w-24 h-24 rounded-2xl bg-[#2d2d2d] border-4 border-[#1e1e1e] overflow-hidden shadow-lg">
                       <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-3">
                       <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-white p-2.5 rounded-lg border border-gray-700 transition-colors">
                          <Share2 size={20} />
                       </button>
                       <a 
                         href={group.link || '#'} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/50 inline-flex items-center gap-2"
                       >
                          Join Group
                          <ExternalLink size={16} />
                       </a>
                    </div>
                 </div>
                 
                 <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
                    <p className="text-gray-400 text-lg leading-relaxed">{group.description}</p>
                 </div>
              </div>
           </div>

           {/* Tabs Navigation (Visual Only) */}
           <div className="border-b border-gray-800 flex gap-8">
              <button className="py-3 px-1 border-b-2 border-blue-500 text-blue-400 font-medium">About</button>
              <button className="py-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-200 transition-colors font-medium">Members</button>
              <button className="py-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-200 transition-colors font-medium">Events</button>
              <button className="py-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-200 transition-colors font-medium">Resources</button>
           </div>

           {/* About Content */}
           <AboutContent group={group} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">User Reviews</h3>
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                 <span>★★★★</span>
                 <span className="text-gray-600">★</span>
                 <span className="text-gray-400 text-sm ml-2">4.5 (120 reviews)</span>
              </div>
           </div>

          <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Related Groups</h3>
            <div className="space-y-4">
              {relatedGroups.map(related => (
                <Link key={related.id} to={`/groups/${related.id}`} className="flex items-center gap-3 group">
                  <img src={related.image} className="w-12 h-12 rounded-lg bg-gray-800 object-cover" alt={related.name} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors truncate">{related.name}</h4>
                    <p className="text-gray-500 text-xs truncate">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const AboutContent = ({ group }: { group: Group }) => (
  <div className="space-y-8 py-4">
    <section>
      <h3 className="text-xl font-bold text-white mb-4">Group Details</h3>
      <div className="bg-[#1e1e1e] rounded-xl border border-gray-800 p-6">
        <div className="grid grid-cols-2 gap-y-6">
          <div>
            <span className="text-gray-500 text-sm block mb-1">Platform</span>
            <span className="text-white font-medium">{group.platform}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm block mb-1">Category</span>
            <span className="text-white font-medium">{group.category}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm block mb-1">Members</span>
            <span className="text-white font-medium">{group.members.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm block mb-1">Created</span>
            <span className="text-white font-medium">{group.createdAt || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-bold text-white mb-4">Description</h3>
      <div className="text-gray-300 leading-relaxed space-y-4">
        <p>{group.longDescription || group.description}</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
    </section>

    {group.rules && (
      <section>
        <h3 className="text-xl font-bold text-white mb-4">Rules</h3>
        <ul className="space-y-3">
          {group.rules.map((rule, idx) => (
            <li key={idx} className="flex gap-3 text-gray-300">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

export default GroupDetail;