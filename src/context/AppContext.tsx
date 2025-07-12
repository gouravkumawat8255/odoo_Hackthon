import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, User, SwapRequest, Rating } from '../types';
import { mockUsers, mockSwapRequests, mockRatings } from '../data/mockData';

interface AppAction {
  type: string;
  payload?: any;
}

const initialState: AppState = {
  currentUser: null,
  users: mockUsers,
  swapRequests: mockSwapRequests,
  ratings: mockRatings,
  isLoading: false,
  searchTerm: '',
  selectedCategory: ''
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    case 'ADD_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: [...state.swapRequests, action.payload]
      };
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        )
      };
    case 'DELETE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.filter(request => request.id !== action.payload)
      };
    case 'ADD_RATING':
      return {
        ...state,
        ratings: [...state.ratings, action.payload]
      };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}