import React from 'react';
import { User, MapPin, Calendar, Star, MessageSquare, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ProfileViewProps {
  userId: string;
  onBack: () => void;
  onSendRequest: (user: any) => void;
}

export function ProfileView({ userId, onBack, onSendRequest }: ProfileViewProps) {
  const { state } = useApp();
  const { users, ratings, currentUser } = state;
  
  const user = users.find(u => u.id === userId);
  const userRatings = ratings.filter(r => r.toUserId === userId);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
          <button
            onClick={onBack}
            className="text-purple-600 hover:text-purple-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to browse</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 sm:px-6 py-8 text-white">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                  <User size={32} />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
                  {user.location && (
                    <div className="flex items-center justify-center sm:justify-start space-x-1">
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center sm:justify-start space-x-1">
                    <Calendar size={16} />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                  {user.totalRatings > 0 && (
                    <div className="flex items-center justify-center sm:justify-start space-x-1">
                      <Star size={16} className="fill-current" />
                      <span>{user.rating.toFixed(1)} ({user.totalRatings})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {currentUser && (
              <button
                onClick={() => onSendRequest(user)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mt-4 sm:mt-0"
              >
                <MessageSquare size={20} />
                <span>Send Request</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Bio */}
          {user.bio && (
            <div>
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          )}

          {/* Skills Offered */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills Offered</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.skillsOffered.map((skill) => (
                <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{skill.name}</h4>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{skill.category}</p>
                  {skill.description && (
                    <p className="text-sm text-gray-500">{skill.description}</p>
                  )}
                </div>
              ))}
            </div>
            {user.skillsOffered.length === 0 && (
              <p className="text-gray-500">No skills offered.</p>
            )}
          </div>

          {/* Skills Wanted */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills Wanted</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.map((skill) => (
                <div key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.name} ({skill.level})
                </div>
              ))}
              {user.skillsWanted.length === 0 && (
                <p className="text-gray-500">No skills wanted listed.</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {user.availability.map((time) => (
                <span key={time} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {time}
                </span>
              ))}
              {user.availability.length === 0 && (
                <p className="text-gray-500">No availability listed.</p>
              )}
            </div>
          </div>

          {/* Reviews */}
          {userRatings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Reviews</h3>
              <div className="space-y-4">
                {userRatings.slice(0, 3).map((rating) => (
                  <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < rating.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.feedback && (
                      <p className="text-gray-600 text-sm">{rating.feedback}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}