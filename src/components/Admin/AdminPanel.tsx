import React, { useState } from 'react';
import { Users, MessageSquare, AlertTriangle, Download, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminPanel() {
  const { state } = useApp();
  const { users, swapRequests, ratings } = state;
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'requests' | 'reports'>('overview');
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  const totalUsers = users.filter(u => !u.isAdmin).length;
  const totalRequests = swapRequests.length;
  const totalCompletedSwaps = swapRequests.filter(r => r.status === 'completed').length;
  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 'N/A';

  const pendingRequests = swapRequests.filter(r => r.status === 'pending');
  const recentUsers = users.filter(u => !u.isAdmin).slice(-5);

  const handleBanUser = (userId: string) => {
    if (confirm('Are you sure you want to ban this user?')) {
      // In a real app, this would update the user's status
      console.log('Banning user:', userId);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send a platform-wide message
      alert('Message sent to all users!');
      setMessage('');
      setShowMessageModal(false);
    }
  };

  const handleDownloadReport = (type: string) => {
    // In a real app, this would generate and download reports
    alert(`Downloading ${type} report...`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users, monitor activity, and platform health</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'requests', label: 'Swap Requests', icon: MessageSquare },
            { id: 'reports', label: 'Reports', icon: Download }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-3 px-4 text-sm font-medium ${
                activeTab === id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">{totalUsers}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{totalRequests}</div>
              <div className="text-gray-600">Total Requests</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{totalCompletedSwaps}</div>
              <div className="text-gray-600">Completed Swaps</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-yellow-600">{averageRating}</div>
              <div className="text-gray-600">Avg Rating</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowMessageModal(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Send size={16} />
                <span>Send Platform Message</span>
              </button>
              <button
                onClick={() => handleDownloadReport('activity')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Download size={16} />
                <span>Download Activity Report</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
              <div className="space-y-3">
                {pendingRequests.slice(0, 5).map((request) => {
                  const fromUser = users.find(u => u.id === request.fromUserId);
                  const toUser = users.find(u => u.id === request.toUserId);
                  return (
                    <div key={request.id} className="text-sm">
                      <div className="font-medium">
                        {fromUser?.name} → {toUser?.name}
                      </div>
                      <div className="text-gray-500">
                        {request.fromUserSkill.name} for {request.requestedSkill.name}
                      </div>
                    </div>
                  );
                })}
                {pendingRequests.length === 0 && (
                  <p className="text-gray-500">No pending requests</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Skills Offered</th>
                    <th className="text-left py-3 px-4">Rating</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => !u.isAdmin).map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {user.profilePhoto ? (
                            <img
                              src={user.profilePhoto}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users size={16} />
                            </div>
                          )}
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">{user.skillsOffered.length}</td>
                      <td className="py-3 px-4">
                        {user.totalRatings > 0 ? (
                          <span>{user.rating.toFixed(1)} ({user.totalRatings})</span>
                        ) : (
                          <span className="text-gray-500">No ratings</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Ban User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Swap Requests Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">From</th>
                    <th className="text-left py-3 px-4">To</th>
                    <th className="text-left py-3 px-4">Exchange</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {swapRequests.map((request) => {
                    const fromUser = users.find(u => u.id === request.fromUserId);
                    const toUser = users.find(u => u.id === request.toUserId);
                    return (
                      <tr key={request.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">{fromUser?.name}</td>
                        <td className="py-3 px-4">{toUser?.name}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm">
                            {request.fromUserSkill.name} ↔ {request.requestedSkill.name}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            request.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">User Activity Report</h3>
              <p className="text-gray-600 mb-4">Download detailed user activity and engagement metrics</p>
              <button
                onClick={() => handleDownloadReport('user-activity')}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Download Report
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Feedback Log</h3>
              <p className="text-gray-600 mb-4">Export all user ratings and feedback data</p>
              <button
                onClick={() => handleDownloadReport('feedback')}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Download Report
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Swap Statistics</h3>
              <p className="text-gray-600 mb-4">Comprehensive swap completion and success rates</p>
              <button
                onClick={() => handleDownloadReport('swap-stats')}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Send Platform Message</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              placeholder="Enter your message to all users..."
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleSendMessage}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
              >
                Send Message
              </button>
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}