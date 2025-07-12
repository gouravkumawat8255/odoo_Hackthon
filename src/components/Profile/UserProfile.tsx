import React, { useState } from 'react';
import { User, MapPin, Calendar, Star, Edit3, Save, X, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Skill } from '../../types';
import { skillCategories, mockSkills } from '../../data/mockData';
import { BlockchainCertificate } from '../Features/BlockchainCertificate';

export function UserProfile() {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(currentUser);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');

  if (!currentUser || !editedUser) return null;

  const handleSave = () => {
    dispatch({ type: 'UPDATE_USER', payload: editedUser });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(currentUser);
    setIsEditing(false);
  };

  const addSkill = (skill: Skill) => {
    if (skillType === 'offered') {
      setEditedUser({
        ...editedUser,
        skillsOffered: [...editedUser.skillsOffered, skill]
      });
    } else {
      setEditedUser({
        ...editedUser,
        skillsWanted: [...editedUser.skillsWanted, skill]
      });
    }
    setShowSkillModal(false);
  };

  const removeSkill = (skillId: string, type: 'offered' | 'wanted') => {
    if (type === 'offered') {
      setEditedUser({
        ...editedUser,
        skillsOffered: editedUser.skillsOffered.filter(s => s.id !== skillId)
      });
    } else {
      setEditedUser({
        ...editedUser,
        skillsWanted: editedUser.skillsWanted.filter(s => s.id !== skillId)
      });
    }
  };

  const availabilityOptions = [
    'Weekday Mornings',
    'Weekday Afternoons', 
    'Weekday Evenings',
    'Weekend Mornings',
    'Weekend Afternoons',
    'Weekend Evenings',
    'Weekends',
    'Evenings'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {editedUser.profilePhoto ? (
                <img
                  src={editedUser.profilePhoto}
                  alt={editedUser.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                  <User size={32} />
                </div>
              )}
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b border-white/50 text-white placeholder-white/70 focus:outline-none focus:border-white"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{editedUser.name}</h1>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  {editedUser.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.location}
                          onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                          className="bg-transparent border-b border-white/50 text-white placeholder-white/70 focus:outline-none focus:border-white"
                        />
                      ) : (
                        <span>{editedUser.location}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined {new Date(editedUser.joinedDate).toLocaleDateString()}</span>
                  </div>
                  {editedUser.totalRatings > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="fill-current" />
                      <span>{editedUser.rating.toFixed(1)} ({editedUser.totalRatings})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg"
                >
                  <Edit3 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Bio */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Bio</h3>
            {isEditing ? (
              <textarea
                value={editedUser.bio || ''}
                onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-600">{editedUser.bio || 'No bio available.'}</p>
            )}
          </div>

          {/* Skills Offered */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Skills I Offer</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    setSkillType('offered');
                    setShowSkillModal(true);
                  }}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Skill
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {editedUser.skillsOffered.map((skill) => (
                <div key={skill.id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill.name} ({skill.level})
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill.id, 'offered')}
                      className="ml-2 text-purple-600 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              {editedUser.skillsOffered.length === 0 && (
                <p className="text-gray-500">No skills offered yet.</p>
              )}
            </div>
          </div>

          {/* Skills Wanted */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Skills I Want to Learn</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    setSkillType('wanted');
                    setShowSkillModal(true);
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                >
                  <Plus size={16} className="inline mr-1" />
                  Add Skill
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {editedUser.skillsWanted.map((skill) => (
                <div key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  {skill.name} ({skill.level})
                  {isEditing && (
                    <button
                      onClick={() => removeSkill(skill.id, 'wanted')}
                      className="ml-2 text-blue-600 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              {editedUser.skillsWanted.length === 0 && (
                <p className="text-gray-500">No skills wanted yet.</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Availability</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {availabilityOptions.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editedUser.availability.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditedUser({
                            ...editedUser,
                            availability: [...editedUser.availability, option]
                          });
                        } else {
                          setEditedUser({
                            ...editedUser,
                            availability: editedUser.availability.filter(a => a !== option)
                          });
                        }
                      }}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedUser.availability.map((time) => (
                  <span key={time} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {time}
                  </span>
                ))}
                {editedUser.availability.length === 0 && (
                  <p className="text-gray-500">No availability set.</p>
                )}
              </div>
            )}
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Privacy Settings</h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editedUser.isPublic}
                onChange={(e) => setEditedUser({ ...editedUser, isPublic: e.target.checked })}
                disabled={!isEditing}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Make my profile public</span>
            </label>
          </div>
        </div>
      </div>

      {/* Blockchain Certificates Section */}
      <div className="mt-8">
        <BlockchainCertificate />
      </div>

      {/* Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              Add {skillType === 'offered' ? 'Offered' : 'Wanted'} Skill
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {mockSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => addSkill(skill)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-gray-600">{skill.category} • {skill.level}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSkillModal(false)}
              className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}