import React from 'react';
import { User, LogOut, Settings, Bell, LogIn, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLoginClick: () => void;
}

export function Header({ currentView, onViewChange, onLoginClick }: HeaderProps) {
  const { state, dispatch } = useApp();
  const { currentUser } = state;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    onViewChange('home');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onViewChange('home')}
              className="flex-shrink-0 cursor-pointer"
            >
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                Skill Swap Platform
              </h1>
              <p className="text-xs text-gray-500 -mt-1 hidden sm:block">by Gourav Silwadiya</p>
            </button>
            
            {currentUser && (
              <nav className="hidden md:flex space-x-4">
                <button
                  onClick={() => onViewChange('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'home'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Browse Skills
                </button>
                <button
                  onClick={() => onViewChange('requests')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'requests'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  My Requests
                </button>
                {currentUser.isAdmin && (
                  <button
                    onClick={() => onViewChange('admin')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Admin Panel
                  </button>
                )}
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {currentUser ? (
              <>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full hidden sm:block">
                  <Bell size={20} />
                </button>
                <button
                  onClick={() => onViewChange('profile')}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  {currentUser.profilePhoto ? (
                    <img
                      src={currentUser.profilePhoto}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{currentUser.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <LogIn size={20} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {currentUser && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex space-x-1">
              <button
                onClick={() => onViewChange('home')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Browse
              </button>
              <button
                onClick={() => onViewChange('requests')}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'requests'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Requests
              </button>
              {currentUser.isAdmin && (
                <button
                  onClick={() => onViewChange('admin')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}