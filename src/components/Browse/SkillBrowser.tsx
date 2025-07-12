import React, { useState } from 'react';
import { Search, Filter, User, MapPin, Star, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User as UserType } from '../../types';
import { skillCategories } from '../../data/mockData';
import { AIMatching } from '../Features/AIMatching';

interface SkillBrowserProps {
  onViewProfile: (userId: string) => void;
  onSendRequest: (user: UserType) => void;
}

export function SkillBrowser({ onViewProfile, onSendRequest }: SkillBrowserProps) {
  const { state, dispatch } = useApp();
  const { users, currentUser, searchTerm, selectedCategory } = state;
  const [showFilters, setShowFilters] = useState(false);

  const filteredUsers = users.filter(user => {
    if (!user.isPublic || user.id === currentUser?.id) return false;
    
    const matchesSearch = !searchTerm || 
      user.skillsOffered.some(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = !selectedCategory ||
      user.skillsOffered.some(skill => skill.category === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Skills</h1>
        <p className="text-gray-600">AI-powered matching to find your perfect learning partner</p>
      </div>

      {/* AI Matching Section */}
      <div className="mb-8">
        <AIMatching />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <button
                onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: '' })}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {skillCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User size={24} className="text-purple-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  {user.location && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin size={14} />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.totalRatings > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Star size={14} className="fill-current text-yellow-400" />
                      <span>{user.rating.toFixed(1)} ({user.totalRatings})</span>
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{user.bio}</p>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Offered:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Availability:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.availability.slice(0, 2).map((time) => (
                    <span
                      key={time}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                    >
                      {time}
                    </span>
                  ))}
                  {user.availability.length > 2 && (
                    <span className="text-gray-500 text-xs">
                      +{user.availability.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onViewProfile(user.id)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onSendRequest(user)}
                  className="flex items-center justify-center bg-purple-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}