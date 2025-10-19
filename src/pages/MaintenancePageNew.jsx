import React, { useState } from 'react';
import { UIIcons } from '../config/icons';

const MaintenancePage = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  
  const [reminderSettings, setReminderSettings] = useState({
    firstOccurrence: '',
    recurring: true,
    repeatEvery: 3,
    repeatUnit: 'month',
    endsType: 'never',
    endsDate: '',
    endsAfter: 1,
    teamMembers: ['Jessica Mattison'],
    addTenants: false
  });

  // Mock data - replace with Supabase query
  const maintenanceRequests = [
    {
      id: 1,
      requestNumber: '259416',
      title: 'Gap in French Doors',
      description: 'There seems to be a gap around the edge of the newly installed French doors.',
      requestedBy: 'Andy Bernard',
      requestedOn: 'Jan 30, 2025',
      dueOn: null,
      property: 'Coastal Villa',
      unit: 'Unit 4B',
      category: 'General',
      priority: 'medium',
      status: 'open',
      photos: [],
      comments: [],
      recurring: null
    },
    {
      id: 2,
      requestNumber: '259415',
      title: 'Leaking Faucet',
      description: 'Kitchen sink faucet is dripping constantly.',
      requestedBy: 'Pam Beesly',
      requestedOn: 'Jan 28, 2025',
      dueOn: 'Feb 5, 2025',
      property: 'Sunset Apartments',
      unit: 'Unit 301',
      category: 'Plumbing',
      priority: 'high',
      status: 'in-progress',
      photos: [],
      comments: [],
      recurring: null
    },
    {
      id: 3,
      requestNumber: '259414',
      title: 'HVAC Filter Replacement',
      description: 'Quarterly HVAC filter replacement needed.',
      requestedBy: 'Jim Halpert',
      requestedOn: 'Jan 25, 2025',
      dueOn: 'Feb 1, 2025',
      property: 'Green Valley Condos',
      unit: 'Unit 102',
      category: 'HVAC',
      priority: 'low',
      status: 'completed',
      photos: [],
      comments: [],
      recurring: {
        frequency: 'Every 3 months',
        nextDue: 'May 1, 2025',
        occurrences: [
          { date: 'Feb 1, 2025', status: 'completed', notes: 'Filter replaced successfully' },
          { date: 'May 1, 2025', status: 'pending', notes: '' },
          { date: 'Aug 1, 2025', status: 'pending', notes: '' }
        ]
      }
    }
  ];

  // Sorting function
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedRequests = () => {
    let filtered = maintenanceRequests;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(req => req.status === filterStatus);
    }
    
    if (!sortField) return filtered;
    
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'requestedOn' || sortField === 'dueOn') {
        aVal = new Date(aVal ||'2099-12-31').getTime();
        bVal = new Date(bVal || '2099-12-31').getTime();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedRequests = getSortedRequests();

  // Status badge
  const getStatusBadge = (status) => {
    const colors = {
      'open': { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
      'in-progress': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
      'completed': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      'on-hold': { bg: '#e5e7eb', text: '#374151', border: '#9ca3af' }
    };
    const color = colors[status] || colors['open'];
    return (
      <span style={{
        padding: '4px 12px',
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.border}`,
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize'
      }}>
        {status}
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
        padding: '4px 12px',
        background: color.bg,
        color: color.text,
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'capitalize'
      }}>
        {priority}
      </span>
    );
  };

  const summaryStats = {
    total: maintenanceRequests.length,
    open: maintenanceRequests.filter(r => r.status === 'open').length,
    inProgress: maintenanceRequests.filter(r => r.status === 'in-progress').length,
    completed: maintenanceRequests.filter(r => r.status === 'completed').length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      padding: '24px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          margin: 0,
          fontSize: '32px',
          fontWeight: '800',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Maintenance
        </h1>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b'
        }}>
          Manage and track maintenance requests
        </p>
      </div>

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start'
      }}>
        {/* Left Side - Table and Filters */}
        <div style={{
          flex: selectedRequest ? '0 0 45%' : 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Filters and New Button - Same Level */}
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            {/* Filter Buttons */}
            {['all', 'open', 'in-progress', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '10px 20px',
                  background: filterStatus === status 
                    ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
                    : 'white',
                  color: filterStatus === status ? 'white' : '#64748b',
                  border: filterStatus === status ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease',
                  boxShadow: filterStatus === status ? '0 4px 12px rgba(20,184,166,0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (filterStatus !== status) {
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== status) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {status === 'all' ? 'All Requests' : status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* New Maintenance Button */}
            <button style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(20,184,166,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(20,184,166,0.3)';
            }}
            >
              <UIIcons.Plus size={16} />
              New Maintenance
            </button>
          </div>

          {/* Data Table */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    borderBottom: '2px solid #e5e7eb'
                  }}>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('requestNumber')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Request #
                        {sortField === 'requestNumber' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('title')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Title
                        {sortField === 'title' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('property')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Property/Unit
                        {sortField === 'property' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('category')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Category
                        {sortField === 'category' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('priority')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Priority
                        {sortField === 'priority' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('status')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Status
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                    <th style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => handleSort('dueOn')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Due Date
                        {sortField === 'dueOn' && (
                          sortDirection === 'asc' ? <UIIcons.ChevronUp size={14} /> : <UIIcons.ChevronDown size={14} />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRequests.map(request => (
                    <tr
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        cursor: 'pointer',
                        background: selectedRequest?.id === request.id ? '#f0fdfa' : 'white',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRequest?.id !== request.id) {
                          e.currentTarget.style.background = '#fafafa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedRequest?.id !== request.id) {
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#0d9488'
                      }}>
                        #{request.requestNumber}
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#1e293b',
                        fontWeight: '500'
                      }}>
                        {request.title}
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        <div>{request.property}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{request.unit}</div>
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {request.category}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {getPriorityBadge(request.priority)}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {getStatusBadge(request.status)}
                      </td>
                      <td style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {request.dueOn || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side - Summary or Detail View */}
        {!selectedRequest ? (
          /* Summary Table */
          <div style={{
            flex: '0 0 300px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #e5e7eb',
            padding: '24px'
          }}>
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Summary
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                borderRadius: '12px',
                border: '2px solid #99f6e4'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  Total Requests
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#0d9488'
                }}>
                  {summaryStats.total}
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#fef3c7',
                borderRadius: '12px',
                border: '2px solid #fbbf24'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#78350f',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  Open
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#92400e'
                }}>
                  {summaryStats.open}
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#dbeafe',
                borderRadius: '12px',
                border: '2px solid #3b82f6'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#1e3a8a',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  In Progress
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#1e40af'
                }}>
                  {summaryStats.inProgress}
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#d1fae5',
                borderRadius: '12px',
                border: '2px solid #10b981'
              }}>
                <div style={{
                  fontSize: '12px',
                  color: '#064e3b',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  Completed
                </div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#065f46'
                }}>
                  {summaryStats.completed}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Detail View */
          <MaintenanceDetailView 
            request={selectedRequest}
            onClose={() => setSelectedRequest(null)}
            showReminderModal={showReminderModal}
            setShowReminderModal={setShowReminderModal}
            showStatusTooltip={showStatusTooltip}
            setShowStatusTooltip={setShowStatusTooltip}
          />
        )}
      </div>

      {/* Set Reminder/Recurrence Modal */}
      {showReminderModal && (
        <ReminderModal
          onClose={() => setShowReminderModal(false)}
          settings={reminderSettings}
          onSave={(newSettings) => {
            setReminderSettings(newSettings);
            setShowReminderModal(false);
            // TODO: Save to database
          }}
        />
      )}

      {/* Status Tooltip Overlay - Click to close */}
      {showStatusTooltip && (
        <div
          onClick={() => setShowStatusTooltip(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999
          }}
        />
      )}
    </div>
  );
};

// Detail View Component
const MaintenanceDetailView = ({ request, onClose, showReminderModal, setShowReminderModal, showStatusTooltip, setShowStatusTooltip }) => {
  return (
    <div style={{
      flex: '0 0 55%',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '2px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: 'calc(100vh - 180px)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '2px solid #e5e7eb',
        background: '#f9fafb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f0fdfa';
                e.currentTarget.style.borderColor = '#14b8a6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <UIIcons.X size={18} style={{ color: '#64748b' }} />
            </button>
            
            <div style={{ flex: 1 }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                {request.title}
              </h2>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Request #{request.requestNumber}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <UIIcons.CheckCircle size={14} />
              Mark as Resolved
            </button>
            <button 
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#64748b',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setShowReminderModal(true)}
            >
              <UIIcons.Calendar size={14} />
              Set Reminder
            </button>
            <button style={{
              padding: '8px 16px',
              background: 'white',
              color: '#64748b',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <UIIcons.Send size={14} />
              Forward
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          padding: '16px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px' }}>
              PROPERTY/UNIT
            </div>
            <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
              {request.property} - {request.unit}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px' }}>
              REQUESTED BY
            </div>
            <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
              {request.requestedBy}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px' }}>
              DATE REQUESTED
            </div>
            <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
              {request.requestedOn}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginBottom: '4px' }}>
              DUE DATE
            </div>
            <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
              {request.dueOn || 'Not set'}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px'
      }}>
        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Description
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#475569',
            lineHeight: '1.6'
          }}>
            {request.description}
          </p>
        </div>

        {/* Recurring Section (if applicable) */}
        {request.recurring && (
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
            borderRadius: '12px',
            border: '2px solid #99f6e4'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              fontWeight: '700',
              color: '#0d9488',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <UIIcons.RefreshCw size={16} />
              Recurring Maintenance
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                Frequency: <strong>{request.recurring.frequency}</strong>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Next Due: <strong>{request.recurring.nextDue}</strong>
              </div>
            </div>

            {/* Occurrences Table */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #99f6e4',
              overflow: 'hidden'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ background: '#f0fdfa' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase'
                    }}>
                      Date
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase'
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase'
                    }}>
                      Notes
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#64748b',
                      textTransform: 'uppercase'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {request.recurring.occurrences.map((occ, index) => (
                    <tr key={index} style={{ borderTop: '1px solid #e5e7eb' }}>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#1e293b'
                      }}>
                        {occ.date}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          background: occ.status === 'completed' ? '#d1fae5' : '#fef3c7',
                          color: occ.status === 'completed' ? '#065f46' : '#92400e',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {occ.status}
                        </span>
                      </td>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: '#64748b'
                      }}>
                        {occ.notes || '-'}
                      </td>
                      <td style={{
                        padding: '12px',
                        textAlign: 'center',
                        position: 'relative'
                      }}>
                        {occ.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setShowStatusTooltip(showStatusTooltip === `${request.id}-${index}` ? null : `${request.id}-${index}`)}
                              style={{
                                padding: '6px 12px',
                                background: 'white',
                                color: '#0d9488',
                                border: '1px solid #99f6e4',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Update Status
                            </button>
                            
                            {/* Status Tooltip */}
                            {showStatusTooltip === `${request.id}-${index}` && (
                              <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '8px',
                                background: 'white',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '200px',
                                padding: '8px'
                              }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Mark as Done');
                                    setShowStatusTooltip(null);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '10px 16px',
                                    background: 'white',
                                    color: '#065f46',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#d1fae5'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                  <UIIcons.Check size={14} />
                                  Mark as Done
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Request Service');
                                    setShowStatusTooltip(null);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '10px 16px',
                                    background: 'white',
                                    color: '#1e40af',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '4px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                  <UIIcons.Wrench size={14} />
                                  Request Service
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit Note');
                                    setShowStatusTooltip(null);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '10px 16px',
                                    background: 'white',
                                    color: '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '4px'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                >
                                  <UIIcons.Edit size={14} />
                                  Edit Note
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Photos Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Photos
          </h3>
          <button style={{
            padding: '12px 24px',
            background: 'white',
            color: '#0d9488',
            border: '2px dashed #99f6e4',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <UIIcons.Upload size={14} />
            Upload Photos
          </button>
        </div>

        {/* Comments Section */}
        <div>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
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
            <textarea
              placeholder="Add a comment..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '80px'
              }}
            />
            <button style={{
              marginTop: '8px',
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <UIIcons.Send size={14} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reminder Modal Component
const ReminderModal = ({ onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}
    onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div style={{
          padding: '24px 32px',
          borderBottom: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            Set Reminder/Recurrence
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UIIcons.X size={20} style={{ color: '#64748b' }} />
          </button>
        </div>

        <div style={{ padding: '24px 32px' }}>
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            Configure when and how often this maintenance task should occur.
          </p>

          {/* Form fields would go here - simplified for now */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              First Occurrence
            </label>
            <input
              type="date"
              value={localSettings.firstOccurrence}
              onChange={(e) => setLocalSettings({...localSettings, firstOccurrence: e.target.value})}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Repeat Every
              </label>
              <input
                type="number"
                value={localSettings.repeatEvery}
                onChange={(e) => setLocalSettings({...localSettings, repeatEvery: parseInt(e.target.value)})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Unit
              </label>
              <select
                value={localSettings.repeatUnit}
                onChange={(e) => setLocalSettings({...localSettings, repeatUnit: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="day">Days</option>
                <option value="week">Weeks</option>
                <option value="month">Months</option>
                <option value="year">Years</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{
          padding: '24px 32px',
          borderTop: '2px solid #e5e7eb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              background: 'white',
              color: '#64748b',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(localSettings)}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Save Reminder
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
