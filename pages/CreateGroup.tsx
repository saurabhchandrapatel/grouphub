import React, { useState, useEffect } from 'react';
import { Upload, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: '',
    category: '',
    image: '',
    link: ''
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [platformsData, categoriesData] = await Promise.all([
          api.getPlatforms(),
          api.getCategories()
        ]);
        setPlatforms(platformsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch options:', error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newGroup = await api.createGroup({
        ...formData,
        platform: formData.platform as any
      });
      alert("Group created successfully!");
      navigate(`/groups/${newGroup.id}`);
    } catch (error) {
      console.error('Failed to create group:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create group: ${errorMessage}. Please try again.`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Create a New Group</h1>
        <p className="text-gray-400">Fill in the details below to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
           <label className="block text-gray-300 text-sm font-medium mb-2">Group Name</label>
           <input 
              type="text" 
              name="name"
              required
              placeholder="e.g. Awesome Web Designers" 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
        </div>

        <div>
           <label className="block text-gray-300 text-sm font-medium mb-2">Group Description</label>
           <textarea 
              rows={4}
              name="description"
              required
              placeholder="Share what your group is all about" 
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all resize-none"
            />
        </div>

        <div>
           <label className="block text-gray-300 text-sm font-medium mb-2">Group Link</label>
           <input 
              type="url" 
              name="link"
              required
              placeholder="https://discord.gg/..." 
              value={formData.link || ''}
              onChange={handleChange}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">Social Media Platform</label>
              <select 
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none appearance-none cursor-pointer"
              >
                 <option value="">Select platform</option>
                 {platforms.map(platform => (
                   <option key={platform} value={platform}>{platform}</option>
                 ))}
              </select>
              <ChevronDown className="absolute right-3 top-[42px] text-gray-500 pointer-events-none w-5 h-5"/>
           </div>

           <div className="relative">
              <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none appearance-none cursor-pointer"
              >
                 <option value="">Select category</option>
                 {categories.map(category => (
                   <option key={category} value={category}>{category}</option>
                 ))}
              </select>
              <ChevronDown className="absolute right-3 top-[42px] text-gray-500 pointer-events-none w-5 h-5"/>
           </div>
        </div>

        <div>
           <label className="block text-gray-300 text-sm font-medium mb-2">Group Image URL (Optional)</label>
           <input 
              type="url" 
              name="image"
              placeholder="https://example.com/image.jpg (leave empty for auto-generated icon)" 
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-[#1e1e1e] border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
            />
           <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate an icon based on group name</p>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20">
           Submit Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;