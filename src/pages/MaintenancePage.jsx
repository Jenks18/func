import React, { useState } from 'react';
import { UIIcons } from '../config/icons';

const MaintenancePage = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(null);
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
      description: 'There seems to be a gap around the edge of the newly installed French doors. I think it probably just needs some weather stripping. It\'s cold and as a bit of air is coming in!',
      requestedBy: 'Andy Bernard',
      requestedOn: 'Jan 30, 2025',
      dueOn: null,
      status: 'open',
      priority: 'medium',
      category: 'Structural',
      property: 'Jefferson House',
      unit: 'House',
      photos: [
        { id: 1, url: '/placeholder-door1.jpg', caption: 'Door gap - left side' },
        { id: 2, url: '/placeholder-door2.jpg', caption: 'Door gap - right side' },
        { id: 3, url: '/placeholder-door3.jpg', caption: 'Weather stripping needed' }
      ],
      notes: [
        {
          id: 1,
          user: 'Jessica Mattison',
          date: 'Jan 30, 2025',
          text: 'Our handyman is out sick so let\'s use the Innago option to get a vetted handyman to have this resolved quickly.'
        }
      ],
      comments: [
        {
          id: 1,
          user: 'Property Manager',
          text: 'Thanks for making us aware of this. We\'ll have a handyman over within 48 h ours to get this corrected for you.',
          date: 'Jan 30, 2025'
        }
      ]
    },
    {
      id: 2,
      requestNumber: '259415',
      title: 'Change Air Filters',
      description: 'Change filter every three months',
      requestedBy: 'Jessica Mattison',
      requestedOn: 'Jan 30, 2025',
      dueOn: 'Apr 30, 2025',
      status: 'scheduled',
      priority: 'low',
      category: 'HVAC',
      property: '605 Race Street',
      unit: null,
      photos: [],
      notes: [],
      comments: [],
      isRecurring: true,
      recurringDetails: {
        frequency: 'This ticket repeats every month effective Thu 1/30/25',
        occurrences: [
          { date: 'Jan 30, 2025', status: 'done' },
          { date: 'Apr 30, 2025', status: 'scheduled' }
        ]
      }
    },
    {
      id: 3,
      requestNumber: '259414',
      title: 'Dishwasher Not Working',
      description: 'Kitchen dishwasher not turning on. Tried resetting circuit breaker.',
      requestedBy: 'Kevin Malone',
      requestedOn: 'Jan 30, 2025',
      dueOn: null,
      status: 'resolved',
      priority: 'high',
      category: 'Appliance',
      property: 'Jefferson Ave Apartments',
      unit: '205',
      photos: [],
      notes: [],
      comments: []
    }
  ];

  // Filter requests
  const filteredRequests = filterStatus === 'all' 
    ? maintenanceRequests 
    : maintenanceRequests.filter(r => r.status === filterStatus);

  // Summary counts
  const summaryStats = {
    open: maintenanceRequests.filter(r => r.status === 'open').length,
    scheduled: maintenanceRequests.filter(r => r.status === 'scheduled').length,
    resolved: maintenanceRequests.filter(r => r.status === 'resolved').length,
    urgent: maintenanceRequests.filter(r => r.priority === 'urgent').length
  };

  const statusColors = {
    open: '#3b82f6',
    scheduled: '#f59e0b',
    resolved: '#10b981',
    cancelled: '#6b7280'
  };

  const statusLabels = {
    open: 'Open',
    scheduled: 'Scheduled',
    resolved: 'Resolved',
    cancelled: 'Cancelled'
  };

  const priorityColors = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981'
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)'
    }}>
      {/* Left Panel - List View */}
      <div style={{
        width: selectedRequest ? '45%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: selectedRequest ? '2px solid #99f6e4' : 'none',
        transition: 'width 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '2px solid #99f6e4',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UIIcons.Wrench size={20} style={{ color: 'white' }} />
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#0f766e'
                }}>
                  Maintenance
                </h1>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '14px',
                  color: '#14b8a6'
                }}>
                  Showing {filteredRequests.length} of {maintenanceRequests.length}
                </p>
              </div>
            </div>

            <button style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(20, 184, 166, 0.3)';
            }}
            onClick={() => {
              console.log('Create new maintenance request...');
              // TODO: Open new request modal
            }}
            >
              <UIIcons.Plus size={16} />
              New Maintenance
            </button>
          </div>

          {/* Filters */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <UIIcons.Filter size={18} style={{ color: '#14b8a6' }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '2px solid #99f6e4',
                fontSize: '13px',
                color: '#0f766e',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <option value="all">All Requests</option>
              <option value="open">Open</option>
              <option value="scheduled">Scheduled</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Maintenance List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px'
        }}>
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: selectedRequest?.id === request.id ? '2px solid #14b8a6' : '2px solid #e5e7eb',
                padding: '20px',
                marginBottom: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedRequest?.id === request.id 
                  ? '0 4px 12px rgba(20, 184, 166, 0.2)' 
                  : '0 2px 4px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                if (selectedRequest?.id !== request.id) {
                  e.currentTarget.style.borderColor = '#99f6e4';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(20, 184, 166, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedRequest?.id !== request.id) {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              {/* Header Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  {request.title}
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: `${statusColors[request.status]}15`,
                  color: statusColors[request.status]
                }}>
                  {statusLabels[request.status]}
                </span>
              </div>

              {/* Metadata */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <UIIcons.Hash size={14} style={{ color: '#14b8a6' }} />
                  {request.requestNumber}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <UIIcons.Calendar size={14} style={{ color: '#14b8a6' }} />
                  {request.requestedOn}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <UIIcons.MapPin size={14} style={{ color: '#14b8a6' }} />
                  {request.property}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                  <UIIcons.User size={14} style={{ color: '#14b8a6' }} />
                  {request.requestedBy}
                </div>
              </div>

              {/* Priority Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: `${priorityColors[request.priority]}15`,
                  color: priorityColors[request.priority],
                  textTransform: 'uppercase'
                }}>
                  {request.priority}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#94a3b8'
                }}>
                  {request.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Detail View */}
      {selectedRequest && (
        <MaintenanceDetailView 
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          showReminderModal={showReminderModal}
          setShowReminderModal={setShowReminderModal}
          showStatusTooltip={showStatusTooltip}
          setShowStatusTooltip={setShowStatusTooltip}
        />
      )}

      {/* Quick Filter Summary (Right Sidebar when no selection) */}
      {!selectedRequest && (
        <div style={{
          width: '300px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderLeft: '2px solid #99f6e4'
        }}>
          <h3 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '700',
            color: '#0f766e'
          }}>
            Quick Filter
          </h3>

          {/* Summary Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setFilterStatus('all')}
              style={{
                padding: '16px',
                background: filterStatus === 'all' ? '#f0fdfa' : 'white',
                border: filterStatus === 'all' ? '2px solid #14b8a6' : '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== 'all') {
                  e.currentTarget.style.borderColor = '#99f6e4';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== 'all') {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f766e', marginBottom: '4px' }}>
                {maintenanceRequests.length}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Total
              </div>
            </button>

            <button
              onClick={() => setFilterStatus('open')}
              style={{
                padding: '16px',
                background: filterStatus === 'open' ? '#eff6ff' : 'white',
                border: filterStatus === 'open' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== 'open') {
                  e.currentTarget.style.borderColor = '#93c5fd';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== 'open') {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                {summaryStats.open}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Open
              </div>
            </button>

            <button
              onClick={() => setFilterStatus('scheduled')}
              style={{
                padding: '16px',
                background: filterStatus === 'scheduled' ? '#fffbeb' : 'white',
                border: filterStatus === 'scheduled' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== 'scheduled') {
                  e.currentTarget.style.borderColor = '#fcd34d';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== 'scheduled') {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                {summaryStats.scheduled}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Scheduled
              </div>
            </button>

            <button
              onClick={() => setFilterStatus('resolved')}
              style={{
                padding: '16px',
                background: filterStatus === 'resolved' ? '#f0fdf4' : 'white',
                border: filterStatus === 'resolved' ? '2px solid #10b981' : '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (filterStatus !== 'resolved') {
                  e.currentTarget.style.borderColor = '#6ee7b7';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== 'resolved') {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                {summaryStats.resolved}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Resolved
              </div>
            </button>

            <div style={{
              marginTop: '12px',
              padding: '16px',
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>
                {summaryStats.urgent}
              </div>
              <div style={{ fontSize: '13px', color: '#ef4444' }}>
                Urgent
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Maintenance Detail View Component (Split Screen Right Panel)
const MaintenanceDetailView = ({ request, onClose, showReminderModal, setShowReminderModal, showStatusTooltip, setShowStatusTooltip }) => {
  return (
    <div style={{
      width: '55%',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
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
          justifyContent: 'between',
          gap: '16px',
          marginBottom: '16px'
        }}>
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
            }}
            onClick={() => setShowReminderModal(true)}
            >
              <UIIcons.Calendar size={14} />
              Set Reminder/Recurrence
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
              Forward Maintenance
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          padding: '16px',
          background: 'white',
          borderRadius: '10px',
          border: '2px solid #e5e7eb'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
              Requested by
            </div>
            <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
              {request.requestedBy}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
              Requested on
            </div>
            <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
              {request.requestedOn}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
              Due on
            </div>
            <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
              {request.dueOn || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px'
      }}>
        {/* Description */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '700',
            color: '#0f766e',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Description
          </h3>
          <div style={{
            padding: '16px',
            background: '#f9fafb',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#1e293b',
            lineHeight: '1.6'
          }}>
            {request.description}
          </div>
        </div>

        {/* Recurring Section */}
        {request.isRecurring && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f766e',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Recurring
              </h3>
              <div style={{
                padding: '2px 8px',
                background: '#f0fdfa',
                border: '1px solid #99f6e4',
                borderRadius: '12px',
                fontSize: '11px',
                color: '#14b8a6',
                fontWeight: '600'
              }}>
                13
              </div>
            </div>

            {/* Frequency Info */}
            <div style={{
              padding: '12px 16px',
              background: '#f9fafb',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '16px'
            }}>
              {request.recurringDetails.frequency}
            </div>

            {/* Occurrences Table */}
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '12px 16px',
                background: '#f9fafb',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Date</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Status</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>Notes</div>
              </div>

              {/* Rows */}
              {request.recurringDetails.occurrences.map((occurrence, index) => (
                <div
                  key={index}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    padding: '12px 16px',
                    borderBottom: index < request.recurringDetails.occurrences.length - 1 ? '1px solid #e5e7eb' : 'none',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#1e293b' }}>{occurrence.date}</div>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowStatusTooltip(showStatusTooltip === `${request.id}-${index}` ? null : `${request.id}-${index}`)}
                      style={{
                        padding: '4px 12px',
                        background: occurrence.status === 'done' ? '#d1fae5' : '#fef3c7',
                        color: occurrence.status === 'done' ? '#065f46' : '#92400e',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {occurrence.status}
                    </button>

                    {/* Status Tooltip */}
                    {showStatusTooltip === `${request.id}-${index}` && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '4px',
                        background: 'white',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 100,
                        minWidth: '180px'
                      }}>
                        <button
                          onClick={() => {
                            // TODO: Mark as done
                            setShowStatusTooltip(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'white',
                            border: 'none',
                            borderBottom: '1px solid #e5e7eb',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <UIIcons.CheckCircle size={14} style={{ color: '#10b981' }} />
                          Mark as Done
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Request service
                            setShowStatusTooltip(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'white',
                            border: 'none',
                            borderBottom: '1px solid #e5e7eb',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <UIIcons.Wrench size={14} style={{ color: '#14b8a6' }} />
                          Request Service
                        </button>
                        <button
                          onClick={() => {
                            // TODO: Edit note
                            setShowStatusTooltip(null);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'white',
                            border: 'none',
                            textAlign: 'left',
                            fontSize: '13px',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '0 0 6px 6px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <UIIcons.FileText size={14} style={{ color: '#64748b' }} />
                          Edit Note
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>N/A</div>
                </div>
              ))}
            </div>

            {/* See More Link */}
            <button
              style={{
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: '#14b8a6',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              See More
            </button>
          </div>
        )}

        {/* Photos */}
        {request.photos && request.photos.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f766e',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Photos
              </h3>
              <button style={{
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <UIIcons.Upload size={12} />
                Add Files
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {request.photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    aspectRatio: '1',
                    background: '#1e293b',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  {/* Placeholder for actual image */}
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '12px',
                    padding: '8px',
                    textAlign: 'center'
                  }}>
                    {photo.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '700',
              color: '#0f766e',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Notes <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>(Only visible to your team, Maintenance)</span>
            </h3>
            <button style={{
              padding: '6px 12px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <UIIcons.Plus size={12} />
              Add Notes
            </button>
          </div>
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            border: '2px solid #e5e7eb'
          }}>
            {request.notes && request.notes.length > 0 ? (
              request.notes.map((note) => (
                <div key={note.id} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {note.user.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                        {note.user}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {note.date}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#475569',
                    lineHeight: '1.6',
                    paddingLeft: '40px'
                  }}>
                    {note.text}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
                No notes yet
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '700',
            color: '#0f766e',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Comments <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '8px' }}>(Visible to all tenants on this lease)</span>
          </h3>
          <div style={{
            background: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            border: '2px solid #e5e7eb'
          }}>
            {request.comments && request.comments.length > 0 ? (
              request.comments.map((comment) => (
                <div key={comment.id} style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                      {comment.user.charAt(0)}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
                      {comment.user}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#475569',
                    lineHeight: '1.6'
                  }}>
                    {comment.text}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
                No comments yet
              </div>
            )}

            {/* Add Comment Input */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px'
            }}>
              <input
                type="text"
                placeholder="Provide an update or ask tenants on this lease..."
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#14b8a6';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              />
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
                gap: '6px'
              }}>
                <UIIcons.Send size={14} />
                Send
              </button>
            </div>
          </div>
        </div>
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99
          }}
        />
      )}
    </div>
  );
};

// Reminder Modal Component
const ReminderModal = ({ onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const updateSetting = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '450px',
      height: '100vh',
      background: 'white',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideInRight 0.3s ease'
    }}>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>

      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '2px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '700',
          color: '#0f766e'
        }}>
          Set Reminder/Recurrence
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            color: '#64748b'
          }}
        >
          <UIIcons.X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px'
      }}>
        {/* Next Occurrence */}
        <div style={{
          padding: '12px 16px',
          background: '#f0fdfa',
          borderRadius: '8px',
          border: '1px solid #99f6e4',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <UIIcons.Calendar size={16} style={{ color: '#14b8a6' }} />
          <span style={{ fontSize: '13px', color: '#0f766e', fontWeight: '500' }}>
            Next Occurrence On: Jul 30, 2025
          </span>
        </div>

        {/* First Occurrence */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#0f766e',
            marginBottom: '8px'
          }}>
            First Occurrence *
          </label>
          <input
            type="date"
            value={localSettings.firstOccurrence}
            onChange={(e) => updateSetting('firstOccurrence', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#1e293b',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#14b8a6';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          />
        </div>

        {/* Recurring Toggle */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#0f766e'
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <input
                type="checkbox"
                checked={localSettings.recurring}
                onChange={(e) => updateSetting('recurring', e.target.checked)}
                style={{ display: 'none' }}
              />
              <div style={{
                width: '44px',
                height: '24px',
                background: localSettings.recurring ? '#14b8a6' : '#cbd5e1',
                borderRadius: '12px',
                transition: 'background 0.2s ease',
                position: 'relative'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: localSettings.recurring ? '22px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>
            Recurring
          </label>
        </div>

        {/* Repeat Every (only if recurring) */}
        {localSettings.recurring && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#0f766e',
                marginBottom: '8px'
              }}>
                Repeat Every
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="number"
                  min="1"
                  value={localSettings.repeatEvery}
                  onChange={(e) => updateSetting('repeatEvery', parseInt(e.target.value))}
                  style={{
                    width: '80px',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1e293b',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#14b8a6';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
                <select
                  value={localSettings.repeatUnit}
                  onChange={(e) => updateSetting('repeatUnit', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#14b8a6';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  <option value="day">Day(s)</option>
                  <option value="week">Week(s)</option>
                  <option value="month">Month(s)</option>
                  <option value="year">Year(s)</option>
                </select>
              </div>
            </div>

            {/* Ends */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#0f766e',
                marginBottom: '12px'
              }}>
                Ends
              </label>
              
              {/* Never */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="endsType"
                  value="never"
                  checked={localSettings.endsType === 'never'}
                  onChange={(e) => updateSetting('endsType', e.target.value)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#14b8a6'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#64748b' }}>Never</span>
              </label>

              {/* On Date */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="endsType"
                  value="on"
                  checked={localSettings.endsType === 'on'}
                  onChange={(e) => updateSetting('endsType', e.target.value)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#14b8a6'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#64748b' }}>On</span>
                <input
                  type="date"
                  disabled={localSettings.endsType !== 'on'}
                  value={localSettings.endsDate}
                  onChange={(e) => updateSetting('endsDate', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1e293b',
                    outline: 'none',
                    opacity: localSettings.endsType !== 'on' ? 0.5 : 1
                  }}
                  onFocus={(e) => {
                    if (localSettings.endsType === 'on') {
                      e.currentTarget.style.borderColor = '#14b8a6';
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
              </label>

              {/* After */}
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}>
                <input
                  type="radio"
                  name="endsType"
                  value="after"
                  checked={localSettings.endsType === 'after'}
                  onChange={(e) => updateSetting('endsType', e.target.value)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#14b8a6'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#64748b' }}>After</span>
                <input
                  type="number"
                  min="1"
                  disabled={localSettings.endsType !== 'after'}
                  value={localSettings.endsAfter}
                  onChange={(e) => updateSetting('endsAfter', parseInt(e.target.value))}
                  style={{
                    width: '60px',
                    padding: '8px 10px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1e293b',
                    outline: 'none',
                    opacity: localSettings.endsType !== 'after' ? 0.5 : 1
                  }}
                  onFocus={(e) => {
                    if (localSettings.endsType === 'after') {
                      e.currentTarget.style.borderColor = '#14b8a6';
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                />
                <span style={{ fontSize: '13px', color: '#64748b' }}>Occurrences</span>
              </label>
            </div>
          </>
        )}

        {/* Add Team Members to Remind */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            marginBottom: '12px'
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <input
                type="checkbox"
                checked={true}
                readOnly
                style={{ display: 'none' }}
              />
              <div style={{
                width: '44px',
                height: '24px',
                background: '#14b8a6',
                borderRadius: '12px',
                position: 'relative'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: '22px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f766e' }}>
              Add Team Members to Remind
            </span>
          </label>

          <div style={{ marginLeft: '56px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#0f766e',
              marginBottom: '8px'
            }}>
              Team Members *
            </label>
            <div style={{
              padding: '8px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              minHeight: '42px',
              alignItems: 'center'
            }}>
              {localSettings.teamMembers.map((member, index) => (
                <div key={index} style={{
                  padding: '4px 10px',
                  background: '#f0fdfa',
                  border: '1px solid #99f6e4',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#0f766e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {member}
                  <button
                    onClick={() => {
                      updateSetting('teamMembers', 
                        localSettings.teamMembers.filter((_, i) => i !== index)
                      );
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      color: '#14b8a6'
                    }}
                  >
                    <UIIcons.X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Tenants to Remind */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#0f766e'
          }}>
            <span>Add Tenants to Remind</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '2px solid #e5e7eb',
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#64748b',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(localSettings)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(20, 184, 166, 0.3)'
          }}
        >
          Save Reminder
        </button>
      </div>
    </div>
  );
};

export default MaintenancePage;
