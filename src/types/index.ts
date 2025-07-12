export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalRatings: number;
  joinedDate: string;
  bio?: string;
  isAdmin: boolean;
  aiMatchScore?: number;
  preferredLearningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  timezone?: string;
  languages?: string[];
  achievements?: Achievement[];
  verificationStatus?: 'pending' | 'verified' | 'expert';
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description?: string;
  aiTags?: string[];
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserSkill: Skill;
  requestedSkill: Skill;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  createdAt: string;
  completedAt?: string;
  meetingLink?: string;
  scheduledTime?: string;
  aiMatchScore?: number;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  ratings: Rating[];
  isLoading: boolean;
  searchTerm: string;
  selectedCategory: string;
}