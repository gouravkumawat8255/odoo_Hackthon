import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { HomePage } from './components/Home/HomePage';
import { UserProfile } from './components/Profile/UserProfile';
import { ProfileView } from './components/Profile/ProfileView';
import { SwapRequests } from './components/Requests/SwapRequests';
import { RequestModal } from './components/Requests/RequestModal';
import { AdminPanel } from './components/Admin/AdminPanel';
import { User } from './types';

function AppContent() {
  const { state } = useApp();
  const { currentUser } = state;
  const [currentView, setCurrentView] = useState('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [requestModalUser, setRequestModalUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('profile-view');
  };

  const handleSendRequest = (user: User) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    setRequestModalUser(user);
  };

  const handleBackToHome = () => {
    setSelectedUserId(null);
    setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return currentUser ? <UserProfile /> : <LoginForm />;
      case 'profile-view':
        return selectedUserId ? (
          <ProfileView
            userId={selectedUserId}
            onBack={handleBackToHome}
            onSendRequest={handleSendRequest}
          />
        ) : null;
      case 'requests':
        return currentUser ? <SwapRequests /> : <LoginForm />;
      case 'admin':
        return currentUser?.isAdmin ? <AdminPanel /> : <LoginForm />;
      default:
        return (
          <HomePage
            onViewProfile={handleViewProfile}
            onSendRequest={handleSendRequest}
            onLoginRequired={() => setShowLoginModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLoginClick={() => setShowLoginModal(true)}
      />
      <main>{renderContent()}</main>
      
      {requestModalUser && (
        <RequestModal
          targetUser={requestModalUser}
          onClose={() => setRequestModalUser(null)}
        />
      )}

      {showLoginModal && !currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <LoginForm />
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;