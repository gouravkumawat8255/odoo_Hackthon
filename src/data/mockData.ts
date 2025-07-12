import { User, Skill, SwapRequest, Rating } from '../types';

export const skillCategories = [
  'Technology',
  'Design',
  'Business',
  'Languages',
  'Music',
  'Sports',
  'Cooking',
  'Crafts',
  'Writing',
  'Photography'
];

export const mockSkills: Skill[] = [
  { id: '1', name: 'React Development', category: 'Technology', level: 'Advanced' },
  { id: '2', name: 'Graphic Design', category: 'Design', level: 'Expert' },
  { id: '3', name: 'Spanish', category: 'Languages', level: 'Intermediate' },
  { id: '4', name: 'Guitar Playing', category: 'Music', level: 'Advanced' },
  { id: '5', name: 'Photography', category: 'Photography', level: 'Expert' },
  { id: '6', name: 'Cooking', category: 'Cooking', level: 'Intermediate' },
  { id: '7', name: 'Writing', category: 'Writing', level: 'Advanced' },
  { id: '8', name: 'Python Programming', category: 'Technology', level: 'Expert' },
  { id: '9', name: 'Digital Marketing', category: 'Business', level: 'Advanced' },
  { id: '10', name: 'Yoga', category: 'Sports', level: 'Intermediate' }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: [mockSkills[0], mockSkills[4]],
    skillsWanted: [mockSkills[1], mockSkills[3]],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.8,
    totalRatings: 24,
    joinedDate: '2024-01-15',
    bio: 'Passionate developer and photographer looking to learn new creative skills.',
    isAdmin: false
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    location: 'Los Angeles, CA',
    profilePhoto: 'https://images.pexels.com/photos/2853592/pexels-photo-2853592.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: [mockSkills[1], mockSkills[6]],
    skillsWanted: [mockSkills[0], mockSkills[7]],
    availability: ['Weekday Mornings', 'Weekends'],
    isPublic: true,
    rating: 4.9,
    totalRatings: 31,
    joinedDate: '2024-02-20',
    bio: 'Creative designer passionate about visual storytelling and eager to learn programming.',
    isAdmin: false
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    location: 'Chicago, IL',
    profilePhoto: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    skillsOffered: [mockSkills[3], mockSkills[5]],
    skillsWanted: [mockSkills[2], mockSkills[9]],
    availability: ['Evenings', 'Weekends'],
    isPublic: true,
    rating: 4.7,
    totalRatings: 18,
    joinedDate: '2024-03-10',
    bio: 'Musician and cooking enthusiast looking to expand my language skills and business knowledge.',
    isAdmin: false
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@skillswap.com',
    location: 'Platform',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: false,
    rating: 5.0,
    totalRatings: 0,
    joinedDate: '2024-01-01',
    bio: 'Platform administrator',
    isAdmin: true
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    fromUserSkill: mockSkills[0],
    requestedSkill: mockSkills[1],
    status: 'pending',
    message: 'Hi! I\'d love to help you learn React in exchange for some graphic design lessons.',
    createdAt: '2024-12-15T10:00:00Z'
  },
  {
    id: '2',
    fromUserId: '2',
    toUserId: '3',
    fromUserSkill: mockSkills[1],
    requestedSkill: mockSkills[3],
    status: 'accepted',
    message: 'I can teach you design fundamentals in exchange for guitar lessons!',
    createdAt: '2024-12-10T14:30:00Z'
  }
];

export const mockRatings: Rating[] = [
  {
    id: '1',
    swapRequestId: '2',
    fromUserId: '2',
    toUserId: '3',
    rating: 5,
    feedback: 'Great teacher! Very patient and knowledgeable.',
    createdAt: '2024-12-12T16:00:00Z'
  }
];