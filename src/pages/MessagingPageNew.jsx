import React, { useState } from 'react';
import { UIIcons } from '../config/icons';

const MessagingPageNew = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'email' or 'chat'
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Empty arrays for clean multi-tenant install - data will come from Supabase when connected
  const sentEmails = [];
  const chatConversations = [];

  const getStatusBadge = (status) => {
    if (status === 'Failed') {
      return (
        <span style={{
          padding: '4px 12px',
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          Failed
        </span>
      );
    }
    return (
      <span style={{
        padding: '4px 12px',
        background: '#d1fae5',
        color: '#065f46',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '600'
      }}>
        Sent
      </span>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: isMobile ? '16px' : '24px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{
          margin: 0,
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Messaging
        </h1>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        gap: '0',
        height: 'calc(100vh - 180px)',
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #99f6e4',
        boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar - Email/Chat Toggle + List */}
        <div style={{
          width: isMobile ? '100%' : '380px',
          minWidth: isMobile ? '100%' : '380px',
          borderRight: isMobile ? 'none' : '2px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          background: 'white'
        }}>
          {/* Tab Navigation */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb'
          }}>
            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'white',
              padding: '4px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => {
                  setActiveTab('email');
                  setSelectedConversation(null);
                  setSelectedEmail(null);
                }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: activeTab === 'email' ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' : 'transparent',
                  color: activeTab === 'email' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <UIIcons.Mail size={16} />
                Email
              </button>
              <button
                onClick={() => {
                  setActiveTab('chat');
                  setSelectedConversation(null);
                  setSelectedEmail(null);
                }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  background: activeTab === 'chat' ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' : 'transparent',
                  color: activeTab === 'chat' ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <UIIcons.Users size={16} />
                Chat
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {activeTab === 'chat' && (
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                position: 'relative'
              }}>
                <UIIcons.Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#14b8a6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Email List or Chat List */}
          <div style={{
            flex: 1,
            overflowY: 'auto'
          }}>
            {activeTab === 'email' ? (
              <>
                {/* Sent Emails Section */}
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #e5e7eb',
                  background: '#f0fdfa'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#0f766e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <UIIcons.Send size={14} />
                      Sent Emails
                    </div>
                    <UIIcons.ChevronRight size={16} color="#0f766e" />
                  </div>
                </div>

                {/* Email Items */}
                {sentEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: selectedEmail?.id === email.id ? '#f0fdfa' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedEmail?.id !== email.id) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedEmail?.id !== email.id) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {email.avatar}
                      </div>

                      {/* Email Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '4px'
                        }}>
                          {email.recipient}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          marginBottom: '4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {email.subject}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8'
                        }}>
                          {email.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Chat Conversations */}
                {chatConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    style={{
                      padding: '16px',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: selectedConversation?.id === conversation.id ? '#f0fdfa' : 'white'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedConversation?.id !== conversation.id) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedConversation?.id !== conversation.id) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        {conversation.avatar}
                      </div>

                      {/* Conversation Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '2px'
                        }}>
                          {conversation.tenant}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginBottom: '4px'
                        }}>
                          {conversation.lastMessage}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8'
                        }}>
                          {conversation.lastMessageTime}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Details/Chat */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white'
        }}>
          {activeTab === 'email' && selectedEmail ? (
            // Email Detail View
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Email Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      {selectedEmail.avatar}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#1e293b',
                        marginBottom: '4px'
                      }}>
                        {selectedEmail.recipient}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {selectedEmail.date}, {selectedEmail.time}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    style={{
                      background: 'white',
                      border: '1px solid #99f6e4',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <UIIcons.Close size={18} color="#0f766e" />
                  </button>
                </div>

                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  {selectedEmail.subject}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  <span>{selectedEmail.propertyUnit}</span>
                  <span>•</span>
                  <span>{selectedEmail.type}</span>
                  <span>•</span>
                  {getStatusBadge(selectedEmail.status)}
                  {selectedEmail.statusAction && (
                    <button style={{
                      padding: '4px 12px',
                      background: '#14b8a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}>
                      {selectedEmail.statusAction}
                    </button>
                  )}
                </div>
              </div>

              {/* Email Body */}
              <div style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto'
              }}>
                <div style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6'
                }}>
                  Email content would be displayed here...
                </div>
              </div>
            </div>
          ) : activeTab === 'chat' && selectedConversation ? (
            // Chat View
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chat Header */}
              <div style={{
                padding: '16px 24px',
                borderBottom: '2px solid #e5e7eb',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      {selectedConversation.avatar}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1e293b'
                      }}>
                        {selectedConversation.tenant}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#64748b'
                      }}>
                        {selectedConversation.propertyUnit} | {selectedConversation.dateRange}
                      </div>
                    </div>
                  </div>
                  <button
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      color: '#64748b'
                    }}
                  >
                    <UIIcons.MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{
                flex: 1,
                padding: '24px',
                overflowY: 'auto',
                background: '#f9fafb'
              }}>
                {/* Date Divider */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#64748b',
                    fontWeight: '600'
                  }}>
                    {selectedConversation.messages[0]?.date}
                  </span>
                </div>

                {/* Messages */}
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.sender === 'landlord' ? 'flex-end' : 'flex-start',
                      marginBottom: '12px'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      background: message.sender === 'landlord' 
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' 
                        : 'white',
                      color: message.sender === 'landlord' ? 'white' : '#1e293b',
                      borderRadius: message.sender === 'landlord' 
                        ? '16px 16px 4px 16px' 
                        : '16px 16px 16px 4px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      border: message.sender === 'landlord' ? 'none' : '1px solid #e5e7eb'
                    }}>
                      <div>{message.text}</div>
                      <div style={{
                        fontSize: '10px',
                        marginTop: '4px',
                        opacity: 0.8,
                        textAlign: 'right'
                      }}>
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #e5e7eb',
                background: 'white'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <button style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UIIcons.Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '24px',
                      fontSize: '14px',
                      outline: 'none',
                      background: '#f9fafb'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#14b8a6';
                      e.target.style.background = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.background = '#f9fafb';
                    }}
                  />
                  <button style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}>
                    <UIIcons.Send size={18} color="white" />
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'email' ? (
            // Email Tab - Table View (No Selection)
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto'
            }}>
              {/* Header with Date Filter and New Message Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <UIIcons.Filter size={16} color="#64748b" />
                  <span style={{
                    fontSize: '13px',
                    color: '#64748b',
                    fontWeight: '600'
                  }}>
                    Date: (From: Jan 23, 25 To: Jan 30, 25 );
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#94a3b8'
                  }}>
                    Showing 05 of 05
                  </span>
                </div>
                <button style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                }}>
                  <UIIcons.Plus size={16} />
                  New Message
                </button>
              </div>

              {/* Email Table */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style={{
                      background: '#f9fafb',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Subject
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Property Name | Unit
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Type
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentEmails.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{
                          padding: '60px 40px',
                          textAlign: 'center',
                          color: '#94a3b8',
                          fontSize: '14px'
                        }}>
                          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
                          <div style={{ fontWeight: '600', marginBottom: '8px', color: '#64748b' }}>
                            No sent emails
                          </div>
                          <div style={{ fontSize: '13px' }}>
                            Your sent messages will appear here
                          </div>
                        </td>
                      </tr>
                    ) : (
                      sentEmails.map((email, index) => (
                        <tr
                          key={email.id}
                          onClick={() => setSelectedEmail(email)}
                          style={{
                            borderBottom: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: index % 2 === 0 ? 'white' : '#f9fafb'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0fdfa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb';
                        }}
                      >
                        <td style={{
                          padding: '14px 16px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'white',
                              flexShrink: 0
                            }}>
                              {email.avatar}
                            </div>
                            <div>
                              <div style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#1e293b',
                                marginBottom: '2px'
                              }}>
                                {email.recipient}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: '#64748b'
                              }}>
                                {email.subject}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          {email.propertyUnit}
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          color: '#64748b',
                          whiteSpace: 'nowrap'
                        }}>
                          {email.date},<br/>{email.time}
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          {email.type}
                        </td>
                        <td style={{
                          padding: '14px 16px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {getStatusBadge(email.status)}
                            {email.statusAction && (
                              <button style={{
                                padding: '4px 12px',
                                background: 'white',
                                color: '#14b8a6',
                                border: '1px solid #14b8a6',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}>
                                {email.statusAction}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Empty State
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <div style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  {activeTab === 'email' ? '📧' : '💬'}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {activeTab === 'email' ? 'Select an email to view' : 'Select a conversation to start chatting'}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#cbd5e1'
                }}>
                  Choose from the list on the left
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingPageNew;
