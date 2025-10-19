import React, { useState } from 'react';
import { Send, Search, Plus, RefreshCw, Filter, Calendar, Download } from 'lucide-react';

const MessagingPage = () => {
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'chat'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('This Month');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Mock data for sent emails
  const sentEmails = [
    {
      id: 1,
      subject: 'Rent Reminder',
      propertyUnit: 'Sunset Apartments - Unit 301',
      date: 'Dec 20, 2024',
      time: '10:30 AM',
      type: 'Automated',
      status: 'Delivered',
      recipient: 'John Smith',
      recipientEmail: 'john.smith@email.com',
      body: 'Your rent payment of $1,500 is due on January 1st, 2025. Please make sure to pay on time to avoid late fees.'
    },
    {
      id: 2,
      subject: 'Lease Renewal Notice',
      propertyUnit: 'Green Valley Condos - Unit 102',
      date: 'Dec 18, 2024',
      time: '2:15 PM',
      type: 'Manual',
      status: 'Delivered',
      recipient: 'Sarah Johnson',
      recipientEmail: 'sarah.j@email.com',
      body: 'Your lease is up for renewal in 60 days. Please contact us to discuss renewal terms.'
    },
    {
      id: 3,
      subject: 'Maintenance Update',
      propertyUnit: 'Oakwood Estates - Unit 205',
      date: 'Dec 15, 2024',
      time: '9:00 AM',
      type: 'Manual',
      status: 'Failed',
      recipient: 'Mike Davis',
      recipientEmail: 'mike.davis@invalid',
      body: 'The plumbing repair in your unit has been completed. Please let us know if you have any issues.'
    },
    {
      id: 4,
      subject: 'Welcome to Your New Home',
      propertyUnit: 'Riverside Towers - Unit 1504',
      date: 'Dec 10, 2024',
      time: '11:45 AM',
      type: 'Automated',
      status: 'Delivered',
      recipient: 'Emily Chen',
      recipientEmail: 'emily.chen@email.com',
      body: 'Welcome! We are excited to have you as a tenant. Here is important information about your new unit.'
    },
    {
      id: 5,
      subject: 'Payment Confirmation',
      propertyUnit: 'Sunset Apartments - Unit 301',
      date: 'Dec 5, 2024',
      time: '3:30 PM',
      type: 'Automated',
      status: 'Delivered',
      recipient: 'John Smith',
      recipientEmail: 'john.smith@email.com',
      body: 'Thank you for your payment of $1,500 received on December 5th, 2024.'
    }
  ];

  // Mock data for chat conversations
  const chatConversations = [
    {
      id: 1,
      tenant: 'John Smith',
      propertyUnit: 'Sunset Apartments - Unit 301',
      avatar: 'JS',
      lastMessage: 'Thank you for the quick response!',
      lastMessageTime: '10:30 AM',
      unread: 0,
      messages: [
        { id: 1, sender: 'tenant', text: 'Hi, I have a question about my lease renewal.', time: '10:15 AM' },
        { id: 2, sender: 'landlord', text: 'Hello John! How can I help you today?', time: '10:20 AM' },
        { id: 3, sender: 'tenant', text: 'What are the renewal terms for my unit?', time: '10:25 AM' },
        { id: 4, sender: 'landlord', text: 'Your renewal will be at $1,550/month with a 12-month lease.', time: '10:28 AM' },
        { id: 5, sender: 'tenant', text: 'Thank you for the quick response!', time: '10:30 AM' }
      ]
    },
    {
      id: 2,
      tenant: 'Sarah Johnson',
      propertyUnit: 'Green Valley Condos - Unit 102',
      avatar: 'SJ',
      lastMessage: 'The heater is working now, thanks!',
      lastMessageTime: 'Yesterday',
      unread: 0,
      messages: []
    },
    {
      id: 3,
      tenant: 'Mike Davis',
      propertyUnit: 'Oakwood Estates - Unit 205',
      avatar: 'MD',
      lastMessage: 'Can you send someone to check the sink?',
      lastMessageTime: '2 days ago',
      unread: 2,
      messages: []
    }
  ];

  const handleRetry = (emailId) => {
    console.log('Retrying email:', emailId);
    // TODO: Implement retry logic with Supabase
  };

  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    // TODO: Implement send message logic with Supabase
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messaging</h1>
          <p className="text-gray-600">Communicate with your tenants via email and chat</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs and Actions Bar */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('email')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'email'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Sent Emails
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeTab === 'chat'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Chat
                </button>
              </div>

              <button
                onClick={() => setShowNewMessageModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <Plus className="w-4 h-4" />
                New Message
              </button>
            </div>
          </div>

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="p-6">
              {/* Filters Bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>Last 3 Months</option>
                      <option>This Year</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-teal-600">05</span> of <span className="font-semibold">05</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Filter className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Emails Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Property/Unit</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentEmails.map((email) => (
                      <tr key={email.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{email.subject}</div>
                            <div className="text-sm text-gray-500">To: {email.recipient}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{email.propertyUnit}</td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{email.date}</div>
                          <div className="text-xs text-gray-500">{email.time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            email.type === 'Automated'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {email.type}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            email.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {email.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {email.status === 'Failed' && (
                            <button
                              onClick={() => handleRetry(email.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Retry
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="flex h-[calc(100vh-280px)]">
              {/* Conversations Sidebar */}
              <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {chatConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-100 transition-colors border-b border-gray-200 ${
                        selectedConversation?.id === conv.id ? 'bg-white' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.avatar}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900 text-sm truncate">{conv.tenant}</span>
                          {conv.unread > 0 && (
                            <span className="ml-2 w-5 h-5 bg-teal-500 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mb-1 truncate">{conv.propertyUnit}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 truncate flex-1">{conv.lastMessage}</span>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{conv.lastMessageTime}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-white">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {selectedConversation.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{selectedConversation.tenant}</div>
                          <div className="text-sm text-gray-600">{selectedConversation.propertyUnit}</div>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {selectedConversation.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'landlord' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-2.5 rounded-2xl ${
                              msg.sender === 'landlord'
                                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <div className="text-sm">{msg.text}</div>
                            <div
                              className={`text-xs mt-1 ${
                                msg.sender === 'landlord' ? 'text-teal-100' : 'text-gray-500'
                              }`}
                            >
                              {msg.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-end gap-3">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={() => handleSendMessage()}
                          className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                        <Send className="w-10 h-10 text-teal-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a conversation</h3>
                      <p className="text-gray-600">Select a conversation from the left or start a new one</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal - Placeholder */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">New Message</h2>
            <p className="text-gray-600 mb-6">Compose a new email or chat message to your tenants.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;
