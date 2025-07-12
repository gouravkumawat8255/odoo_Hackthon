import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AIMatching() {
  const { state } = useApp();
  const { currentUser, users } = state;
  const [matches, setMatches] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const calculateAIMatch = (user1: any, user2: any) => {
    let score = 0;
    
    // Skill compatibility
    const user1Wants = user1.skillsWanted.map((s: any) => s.name.toLowerCase());
    const user2Offers = user2.skillsOffered.map((s: any) => s.name.toLowerCase());
    const skillMatch = user1Wants.filter((skill: string) => 
      user2Offers.some((offered: string) => offered.includes(skill) || skill.includes(offered))
    ).length;
    
    score += skillMatch * 30;
    
    // Location proximity
    if (user1.location && user2.location && user1.location === user2.location) {
      score += 20;
    }
    
    // Availability overlap
    const availabilityMatch = user1.availability.filter((time: string) => 
      user2.availability.includes(time)
    ).length;
    score += availabilityMatch * 15;
    
    // Rating compatibility
    if (Math.abs(user1.rating - user2.rating) < 1) {
      score += 10;
    }
    
    // Learning style compatibility
    if (user1.preferredLearningStyle === user2.preferredLearningStyle) {
      score += 15;
    }
    
    return Math.min(score, 100);
  };

  const findAIMatches = () => {
    if (!currentUser) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const potentialMatches = users
        .filter(user => user.id !== currentUser.id && !user.isAdmin && user.isPublic)
        .map(user => ({
          ...user,
          aiMatchScore: calculateAIMatch(currentUser, user)
        }))
        .filter(user => user.aiMatchScore > 30)
        .sort((a, b) => b.aiMatchScore - a.aiMatchScore)
        .slice(0, 5);
      
      setMatches(potentialMatches);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    if (currentUser) {
      findAIMatches();
    }
  }, [currentUser]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Brain className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI-Powered Matching</h2>
          <p className="text-gray-600 text-sm">Smart recommendations based on your profile</p>
        </div>
      </div>

      {isAnalyzing ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your profile...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {match.profilePhoto ? (
                    <img src={match.profilePhoto} alt={match.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">{match.name[0]}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{match.name}</h3>
                    <p className="text-sm text-gray-600">{match.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Zap className="text-yellow-500" size={16} />
                    <span className="text-sm font-semibold text-gray-900">{match.aiMatchScore}%</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    match.aiMatchScore >= 80 ? 'bg-green-100 text-green-800' :
                    match.aiMatchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {match.aiMatchScore >= 80 ? 'Perfect Match' :
                     match.aiMatchScore >= 60 ? 'Good Match' : 'Potential Match'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">They offer:</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skillsOffered.slice(0, 2).map((skill: any) => (
                      <span key={skill.id} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Match reasons:</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Target size={12} />
                    <span>Skill compatibility</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {matches.length === 0 && !isAnalyzing && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No AI matches found. Update your profile for better recommendations!</p>
            </div>
          )}
        </div>
      )}
      
      <button
        onClick={findAIMatches}
        disabled={isAnalyzing}
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
      >
        {isAnalyzing ? 'Analyzing...' : 'Refresh AI Matches'}
      </button>
    </div>
  );
}