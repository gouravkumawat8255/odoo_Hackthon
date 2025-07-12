import React, { useState } from 'react';
import { Clock, Check, X, Star, MessageSquare, User, Calendar, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SwapRequest } from '../../types';

export function SwapRequests() {
  const { state, dispatch } = useApp();
  const { swapRequests, currentUser, users } = state;
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');

  const receivedRequests = swapRequests.filter(req => req.toUserId === currentUser?.id);
  const sentRequests = swapRequests.filter(req => req.fromUserId === currentUser?.id);

  const handleRequestAction = (requestId: string, action: 'accept' | 'reject' | 'delete') => {
    const request = swapRequests.find(req => req.id === requestId);
    if (!request) return;

    if (action === 'delete') {
      dispatch({ type: 'DELETE_SWAP_REQUEST', payload: requestId });
      return;
    }

    let newStatus: SwapRequest['status'];
    switch (action) {
      case 'accept':
        newStatus = 'accepted';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      default:
        return;
    }

    dispatch({
      type: 'UPDATE_SWAP_REQUEST',
      payload: { ...request, status: newStatus }
    });
  };

  const handleCompleteSwap = (requestId: string) => {
    const request = swapRequests.find(req => req.id === requestId);
    if (!request) return;

    dispatch({
      type: 'UPDATE_SWAP_REQUEST',
      payload: { ...request, status: 'completed', completedAt: new Date().toISOString() }
    });
    setShowRatingModal(requestId);
  };

  const submitRating = () => {
    if (!showRatingModal) return;

    const request = swapRequests.find(req => req.id === showRatingModal);
    if (!request) return;

    const newRating = {
      id: Date.now().toString(),
      swapRequestId: showRatingModal,
      fromUserId: currentUser?.id || '',
      toUserId: activeTab === 'received' ? request.fromUserId : request.toUserId,
      rating,
      feedback,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_RATING', payload: newRating });
    setShowRatingModal(null);
    setRating(5);
    setFeedback('');
  };

  const getUserById = (userId: string) => users.find(user => user.id === userId);

  const RequestCard = ({ request }: { request: SwapRequest }) => {
    const otherUser = getUserById(
      activeTab === 'received' ? request.fromUserId : request.toUserId
    );
    
    if (!otherUser) return null;

    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            {otherUser.profilePhoto ? (
              <img
                src={otherUser.profilePhoto}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <User size={24} className="text-purple-600" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{otherUser.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'received' ? 'They offer:' : 'You offer:'}
              </h4>
              <div className="bg-purple-50 p-2 rounded">
                <span className="text-sm font-medium text-purple-800">
                  {activeTab === 'received' ? request.fromUserSkill.name : request.requestedSkill.name}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                {activeTab === 'received' ? 'They want:' : 'You want:'}
              </h4>
              <div className="bg-blue-50 p-2 rounded">
                <span className="text-sm font-medium text-blue-800">
                  {activeTab === 'received' ? request.requestedSkill.name : request.fromUserSkill.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {request.message && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{request.message}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {request.status === 'pending' && activeTab === 'received' && (
            <>
              <button
                onClick={() => handleRequestAction(request.id, 'accept')}
                className="flex items-center space-x-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                <Check size={16} />
                <span>Accept</span>
              </button>
              <button
                onClick={() => handleRequestAction(request.id, 'reject')}
                className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                <X size={16} />
                <span>Reject</span>
              </button>
            </>
          )}

          {request.status === 'pending' && activeTab === 'sent' && (
            <button
              onClick={() => handleRequestAction(request.id, 'delete')}
              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
            >
              <Trash2 size={16} />
              <span>Delete Request</span>
            </button>
          )}

          {request.status === 'accepted' && (
            <button
              onClick={() => handleCompleteSwap(request.id)}
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              <Check size={16} />
              <span>Mark Complete</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please login to view requests</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Swap Requests</h1>
        <p className="text-gray-600">Manage your skill exchange requests</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'received'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'sent'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      {/* Request List */}
      <div className="space-y-4">
        {(activeTab === 'received' ? receivedRequests : sentRequests).map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>

      {(activeTab === 'received' ? receivedRequests : sentRequests).length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} requests
          </h3>
          <p className="text-gray-500">
            {activeTab === 'received' 
              ? 'When someone wants to swap skills with you, their requests will appear here.'
              : 'Requests you send to other users will appear here.'
            }
          </p>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    <Star className="fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={3}
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={submitRating}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Submit Rating
              </button>
              <button
                onClick={() => setShowRatingModal(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}