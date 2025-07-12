import React, { useState } from 'react';
import { X, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User as UserType, Skill } from '../../types';

interface RequestModalProps {
  targetUser: UserType;
  onClose: () => void;
}

export function RequestModal({ targetUser, onClose }: RequestModalProps) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;
  const [selectedMySkill, setSelectedMySkill] = useState<Skill | null>(null);
  const [selectedTheirSkill, setSelectedTheirSkill] = useState<Skill | null>(null);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMySkill || !selectedTheirSkill || !currentUser) return;

    const newRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: targetUser.id,
      fromUserSkill: selectedMySkill,
      requestedSkill: selectedTheirSkill,
      status: 'pending' as const,
      message,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newRequest });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Send Swap Request</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg">
            {targetUser.profilePhoto ? (
              <img
                src={targetUser.profilePhoto}
                alt={targetUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <User size={24} className="text-purple-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold">{targetUser.name}</h3>
              <p className="text-sm text-gray-600">{targetUser.location}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I can offer:
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {currentUser?.skillsOffered.map((skill) => (
                  <label key={skill.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mySkill"
                      value={skill.id}
                      checked={selectedMySkill?.id === skill.id}
                      onChange={() => setSelectedMySkill(skill)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">{skill.name} ({skill.level})</span>
                  </label>
                ))}
              </div>
              {(!currentUser?.skillsOffered.length) && (
                <p className="text-sm text-gray-500">
                  You need to add skills to your profile first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In exchange for:
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {targetUser.skillsOffered.map((skill) => (
                  <label key={skill.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theirSkill"
                      value={skill.id}
                      checked={selectedTheirSkill?.id === skill.id}
                      onChange={() => setSelectedTheirSkill(skill)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">{skill.name} ({skill.level})</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Introduce yourself and explain what you'd like to learn..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!selectedMySkill || !selectedTheirSkill}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Request
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}