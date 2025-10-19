import React, { useState } from 'react';
import { UIIcons } from '../../config/icons';

export default function MaintenanceDetailView({ 
  selectedRequest, 
  allRequests, 
  onRequestSelect, 
  onClose,
  isMobile 
}) {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Status badge function
  const getStatusBadge = (status) => {
    const colors = {
      'open': { bg: '#dbeafe', text: '#1e3a8a', border: '#3b82f6' },
      'in-progress': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
      'completed': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      'on-hold': { bg: '#e5e7eb', text: '#374151', border: '#9ca3af' },
      'pending': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' }
    };
    const color = colors[status] || colors['open'];
    return (
      <span style={{
        padding: '4px 10px',
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'capitalize',
        whiteSpace: 'nowrap'
      }}>
        {status === 'in-progress' ? 'In Progress' : status}
      </span>
    );
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    const colors = {
      'low': { bg: '#f3f4f6', text: '#6b7280' },
      'medium': { bg: '#fef3c7', text: '#92400e' },
      'high': { bg: '#fee2e2', text: '#991b1b' },
      'urgent': { bg: '#fecaca', text: '#7f1d1d' }
    };
    const color = colors[priority] || colors['low'];
    return (
      <span style={{
        padding: '4px 10px',
        background: color.bg,
        color: color.text,
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'capitalize'
      }}>
        {priority}
      </span>
    );
  };

  return (
    <div style={{
      display: 'flex',
      gap: '0',
      height: isMobile ? 'auto' : 'calc(100vh - 280px)',
      maxHeight: isMobile ? 'none' : 'calc(100vh - 280px)',
      overflow: 'hidden',
      borderRadius: '16px',
      border: '1px solid #99f6e4',
      boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
      width: '100%',
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {/* Left side - Compressed request list (280px fixed) */}
      {!isMobile && (
        <div style={{
          width: '280px',
          minWidth: '280px',
          maxWidth: '280px',
          borderRight: '2px solid #e5e7eb',
          background: 'white',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          height: '100%'
        }}>
          {/* Filter Section */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
            flexShrink: 0
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '700',
              color: '#0f766e',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              MAINTENANCE REQUESTS
            </div>
            <div style={{
              fontSize: '13px',
              color: '#134e4a',
              fontWeight: '600'
            }}>
              Showing {allRequests.length} of {allRequests.length}
            </div>
          </div>

          {/* Compressed Table */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto',
            overflowX: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0 6px',
              padding: '12px'
            }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '8px 10px',
                    textAlign: 'left',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    position: 'sticky',
                    top: 0,
                    background: 'white',
                    zIndex: 1
                  }}>
                    Request #
                  </th>
                  <th style={{
                    padding: '8px 10px',
                    textAlign: 'left',
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    position: 'sticky',
                    top: 0,
                    background: 'white',
                    zIndex: 1
                  }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {allRequests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => onRequestSelect(request)}
                    style={{
                      cursor: 'pointer',
                      background: selectedRequest?.id === request.id 
                        ? 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)' 
                        : 'white',
                      borderLeft: selectedRequest?.id === request.id 
                        ? '3px solid #14b8a6' 
                        : '3px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      if (selectedRequest?.id !== request.id) {
                        e.currentTarget.style.background = '#f9fafb';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedRequest?.id !== request.id) {
                        e.currentTarget.style.background = 'white';
                      }
                    }}
                  >
                    <td style={{
                      padding: '10px',
                      fontSize: '11px',
                      color: '#14b8a6',
                      fontWeight: '600'
                    }}>
                      #{request.requestNumber}
                    </td>
                    <td style={{
                      padding: '10px'
                    }}>
                      {getStatusBadge(request.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Right side - Detail panel */}
      <div style={{
        flex: 1,
        background: 'white',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header with close button */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '2px solid #e5e7eb',
          background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '11px',
                color: '#14b8a6',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                Request #{selectedRequest.requestNumber}
              </div>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                {selectedRequest.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'white',
                border: '1px solid #99f6e4',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0fdfa';
                e.target.style.borderColor = '#14b8a6';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#99f6e4';
              }}
            >
              <UIIcons.Close size={18} color="#0f766e" />
            </button>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
              }}
            >
              <UIIcons.Check size={14} />
              Mark as Resolved
            </button>
            <button
              onClick={() => setShowReminderModal(true)}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#0f766e',
                border: '1px solid #99f6e4',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0fdfa';
                e.target.style.borderColor = '#14b8a6';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#99f6e4';
              }}
            >
              <UIIcons.Bell size={14} />
              Set Reminder/Recurrence
            </button>
            <button
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#0f766e',
                border: '1px solid #99f6e4',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0fdfa';
                e.target.style.borderColor = '#14b8a6';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#99f6e4';
              }}
            >
              <UIIcons.Wrench size={14} />
              Request Service
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, padding: '24px' }}>
          {/* Meta information */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '16px',
            marginBottom: '24px',
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Requested by
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '600'
              }}>
                {selectedRequest.requestedBy.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b'
              }}>
                {selectedRequest.requestedBy.email}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Requested on
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '600'
              }}>
                {selectedRequest.requestedOn}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Property / Unit
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '600'
              }}>
                {selectedRequest.property}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#64748b'
              }}>
                {selectedRequest.unit}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Due on
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '600'
              }}>
                {selectedRequest.dueOn || '-'}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Category
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                fontWeight: '600'
              }}>
                {selectedRequest.category}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Priority
              </div>
              <div>
                {getPriorityBadge(selectedRequest.priority)}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '600',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Status
              </div>
              <div>
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Description
            </h3>
            <div style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              color: '#475569',
              lineHeight: '1.6'
            }}>
              {selectedRequest.description}
            </div>
          </div>

          {/* Recurring Maintenance Section */}
          {selectedRequest.recurring && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                Recurring Maintenance
              </h3>
              <div style={{
                padding: '16px',
                background: '#f0fdfa',
                borderRadius: '8px',
                border: '1px solid #99f6e4',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#0f766e',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {selectedRequest.recurring.frequency}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  Next due: {selectedRequest.recurring.nextDue}
                </div>
              </div>

              {/* Occurrences Table */}
              <div style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
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
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Notes
                      </th>
                      <th style={{
                        padding: '10px 12px',
                        textAlign: 'right',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748b',
                        textTransform: 'uppercase'
                      }}>
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.recurring.occurrences.map((occurrence) => (
                      <tr
                        key={occurrence.id}
                        style={{
                          borderBottom: '1px solid #e5e7eb'
                        }}
                      >
                        <td style={{
                          padding: '12px',
                          fontSize: '13px',
                          color: '#1e293b',
                          fontWeight: '500'
                        }}>
                          {occurrence.date}
                        </td>
                        <td style={{
                          padding: '12px'
                        }}>
                          {getStatusBadge(occurrence.status)}
                        </td>
                        <td style={{
                          padding: '12px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          {occurrence.notes || '-'}
                        </td>
                        <td style={{
                          padding: '12px',
                          textAlign: 'right'
                        }}>
                          {occurrence.status === 'pending' && (
                            <button
                              onClick={() => setShowStatusTooltip(occurrence.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'white',
                                color: '#14b8a6',
                                border: '1px solid #99f6e4',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = '#f0fdfa';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = 'white';
                              }}
                            >
                              Update Status
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

          {/* Photos */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                Photos
              </h3>
              <button
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  color: '#14b8a6',
                  border: '1px solid #99f6e4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f0fdfa';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                <UIIcons.Plus size={14} />
                Add Files
              </button>
            </div>

            {selectedRequest.photos.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px'
              }}>
                {selectedRequest.photos.map((photo) => (
                  <div
                    key={photo.id}
                    style={{
                      aspectRatio: '1',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#14b8a6';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px dashed #e5e7eb',
                color: '#94a3b8',
                fontSize: '13px'
              }}>
                No photos uploaded yet
              </div>
            )}
          </div>

          {/* Notes/Comments */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                Notes
              </h3>
              <button
                style={{
                  padding: '6px 12px',
                  background: 'white',
                  color: '#14b8a6',
                  border: '1px solid #99f6e4',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f0fdfa';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'white';
                }}
              >
                <UIIcons.Plus size={14} />
                Add Notes
              </button>
            </div>

            {selectedRequest.notes && selectedRequest.notes.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedRequest.notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#1e293b',
                          marginBottom: '2px'
                        }}>
                          {note.user}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8'
                        }}>
                          {note.date}
                        </div>
                      </div>
                      <button
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          color: '#94a3b8',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = '#e5e7eb';
                          e.target.style.color = '#64748b';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'transparent';
                          e.target.style.color = '#94a3b8';
                        }}
                      >
                        <UIIcons.MoreHorizontal size={16} />
                      </button>
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#475569',
                      lineHeight: '1.5'
                    }}>
                      {note.text}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px dashed #e5e7eb',
                color: '#94a3b8',
                fontSize: '13px'
              }}>
                Only visible to your team members
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Comments
            </h3>
            <div style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              marginBottom: '12px'
            }}>
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                marginBottom: '8px',
                fontStyle: 'italic'
              }}>
                Tenants will be notified via email about all comments made on this request
              </div>
              {selectedRequest.comments && selectedRequest.comments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  {selectedRequest.comments.map((comment) => (
                    <div
                      key={comment.id}
                      style={{
                        padding: '12px',
                        background: 'white',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
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
                          color: 'white'
                        }}>
                          {comment.user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#1e293b'
                          }}>
                            {comment.user.name}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#94a3b8'
                          }}>
                            {comment.date}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#475569',
                        lineHeight: '1.5'
                      }}>
                        {comment.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  fontSize: '13px',
                  color: '#94a3b8',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  No comments yet
                </div>
              )}
            </div>

            {/* Add comment textarea */}
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
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
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '8px'
              }}>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                  }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                Set Reminder / Recurrence
              </h3>
              <button
                onClick={() => setShowReminderModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#94a3b8',
                  borderRadius: '4px'
                }}
              >
                <UIIcons.Close size={20} />
              </button>
            </div>

            <div style={{
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '20px'
            }}>
              Configure recurring maintenance schedule for this request
            </div>

            {/* Modal content would go here */}
            <div style={{
              padding: '40px',
              background: '#f9fafb',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#94a3b8',
              marginBottom: '20px'
            }}>
              Reminder configuration form
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowReminderModal(false)}
                style={{
                  padding: '10px 20px',
                  background: 'white',
                  color: '#64748b',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(20,184,166,0.3)'
                }}
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
