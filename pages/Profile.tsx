import React, { useState, useEffect } from 'react';
import { User, Group } from '../types';
import { Link } from 'react-router-dom';
import { ChevronRight, Settings, LogOut, Trash2 } from 'lucide-react';
import { api } from '../api';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: user.name, email: user.email });

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const groups = await api.getUserGroups(user.id);
        setUserGroups(groups);
      } catch (error) {
        console.error('Failed to fetch user groups:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load groups';
        alert(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGroups();
  }, [user.id]);

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await api.leaveGroup(user.id, groupId);
      setUserGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (error) {
      console.error('Failed to leave group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave group';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await api.updateUser(user.id, editData);
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Sidebar Menu */}
          <div className="space-y-6">
             <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 mb-4">
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full border-4 border-[#1e1e1e] object-cover" />
                </div>
                {editMode ? (
                  <div className="space-y-2">
                    <input 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full bg-[#2d2d2d] text-white px-3 py-1 rounded text-center"
                    />
                    <input 
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full bg-[#2d2d2d] text-white px-3 py-1 rounded text-center text-sm"
                    />
                    <div className="flex gap-2 justify-center">
                      <button onClick={handleUpdateProfile} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Save</button>
                      <button onClick={() => setEditMode(false)} className="bg-gray-600 text-white px-3 py-1 rounded text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <button onClick={() => setEditMode(true)} className="text-blue-400 text-xs mt-1">Edit</button>
                  </div>
                )}
             </div>

             <SidebarNavigation />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Groups</h1>
                <p className="text-gray-400">Manage the communities you are part of.</p>
             </div>

             {loading ? (
                <LoadingState />
             ) : userGroups.length > 0 ? (
                <GroupsList groups={userGroups} onLeaveGroup={handleLeaveGroup} />
             ) : (
                <EmptyGroupsState />
             )}

             <div className="mt-12 pt-8 border-t border-gray-800">
                 <h2 className="text-2xl font-bold text-white mb-6">Danger Zone</h2>
                 <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6">
                    <h3 className="text-red-400 font-bold mb-2">Delete Account</h3>
                    <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all of your content. This action is not reversible.</p>
                     <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors">
                       Delete My Account
                    </button>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400">Loading groups...</div>
  </div>
);

const GroupsList = ({ groups, onLeaveGroup }: { groups: Group[]; onLeaveGroup: (id: string) => void }) => {
  const handleLeaveClick = async (groupId: string) => {
    try {
      await onLeaveGroup(groupId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave group';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {groups.map(group => (
        <div key={group.id} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-4 flex items-center gap-4 hover:border-gray-600 transition-colors">
          <img src={group.image} alt={group.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{group.name}</h3>
            <p className="text-sm text-gray-400">{group.members.toLocaleString()} members • {group.platform}</p>
          </div>
          <div className="flex gap-2">
            <Link to={`/groups/${group.id}`} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-white transition-colors">
              View
            </Link>
            {group.link && (
              <a 
                href={group.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-colors"
              >
                Join
              </a>
            )}
            <button 
              onClick={() => handleLeaveClick(group.id)}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors" 
              title="Leave Group"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const SidebarNavigation = () => (
  <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden">
    <nav className="flex flex-col">
      <button className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors text-left border-l-4 border-blue-500 bg-gray-800/50">
        <span className="font-medium text-white">My Groups</span>
        <ChevronRight size={16} className="text-gray-500"/>
      </button>
      <button className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors text-left text-gray-400 hover:text-white border-l-4 border-transparent">
        <span className="font-medium">Account Settings</span>
        <Settings size={16} className="text-gray-500"/>
      </button>
      <button className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors text-left text-red-400 hover:text-red-300 border-l-4 border-transparent">
        <span className="font-medium">Log Out</span>
        <LogOut size={16}/>
      </button>
    </nav>
  </div>
);

const EmptyGroupsState = () => (
  <div className="text-center py-12 bg-[#1e1e1e] rounded-xl border border-gray-800">
    <p className="text-gray-400 mb-4">You haven't joined any groups yet.</p>
    <Link to="/explore" className="text-blue-500 hover:underline">Explore groups</Link>
  </div>
);

export default Profile;