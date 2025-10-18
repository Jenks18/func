import React, { useState } from 'react';
import { UIIcons } from '../config/icons';
import MaintenanceDetailView from '../components/maintenance/MaintenanceDetailView';

const MaintenancePage = () => {
  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Empty array for clean multi-tenant install - data will come from Supabase when connected
  const maintenanceRequests = [];

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
        aVal = new Date(aVal || '2099-12-31').getTime();
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
      'open': { bg: '#dbeafe', text: '#1e3a8a', border: '#3b82f6' },
      'in-progress': { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
      'completed': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
      'on-hold': { bg: '#e5e7eb', text: '#374151', border: '#9ca3af' }
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

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    const Icon = sortDirection === 'asc' ? UIIcons.ChevronUp : UIIcons.ChevronDown;
    return <Icon size={14} style={{ marginLeft: '4px' }} />;
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
          Maintenance
        </h1>
        <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b'
        }}>
          Manage and track all maintenance requests
        </p>
      </div>

      {/* Main Content - Show either table view or detail view */}
      {selectedRequest ? (
        <MaintenanceDetailView
          selectedRequest={selectedRequest}
          allRequests={sortedRequests}
          onRequestSelect={setSelectedRequest}
          onClose={() => setSelectedRequest(null)}
          isMobile={isMobile}
        />
      ) : (
        <>
          {/* Filters and New Maintenance Button */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
            padding: '16px 20px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              {/* Left side - Filters */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flex: 1,
                flexWrap: 'wrap'
              }}>
                {['all', 'open', 'in-progress', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    style={{
                      padding: '8px 16px',
                      background: filterStatus === status 
                        ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' 
                        : 'white',
                      color: filterStatus === status ? 'white' : '#0f766e',
                      border: filterStatus === status ? 'none' : '1px solid #99f6e4',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textTransform: 'capitalize',
                      boxShadow: filterStatus === status ? '0 2px 8px rgba(20,184,166,0.3)' : 'none'
                    }}
                  >
                    {status === 'in-progress' ? 'In Progress' : status}
                    {status !== 'all' && (
                      <span style={{
                        marginLeft: '6px',
                        padding: '2px 6px',
                        background: filterStatus === status ? 'rgba(255,255,255,0.2)' : '#f0fdfa',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: '700'
                      }}>
                        {status === 'in-progress' 
                          ? summaryStats.inProgress 
                          : summaryStats[status]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            
              {/* Right side - New Maintenance Button */}
              <button
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                  e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                  e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                }}
              >
                + New Maintenance
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            boxShadow: '0 4px 12px rgba(20,184,166,0.15)',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                    borderBottom: '2px solid #99f6e4'
                  }}>
                    <th
                      onClick={() => handleSort('requestNumber')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Request #
                        {renderSortIcon('requestNumber')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('title')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Title
                        {renderSortIcon('title')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('property')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Property / Unit
                        {renderSortIcon('property')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('category')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Category
                        {renderSortIcon('category')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('priority')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Priority
                        {renderSortIcon('priority')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('status')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Status
                        {renderSortIcon('status')}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('dueOn')}
                      style={{
                        padding: '14px 16px',
                        textAlign: 'left',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0f766e',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        Due Date
                        {renderSortIcon('dueOn')}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRequests.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{
                        padding: '60px 40px',
                        textAlign: 'center',
                        color: '#94a3b8',
                        fontSize: '14px'
                      }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
                        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#64748b' }}>
                          No maintenance requests
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          All maintenance requests will appear here
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedRequests.map((request, index) => (
                      <tr
                        key={request.id}
                        onClick={() => setSelectedRequest(request)}
                        style={{
                          borderBottom: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: index % 2 === 0 ? 'white' : '#f9fafb'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f0fdfa';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb';
                        }}
                      >
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '13px',
                          color: '#14b8a6',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}>
                          #{request.requestNumber}
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '13px',
                          color: '#1e293b',
                          fontWeight: '500'
                        }}>
                          {request.title}
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          <div>{request.property}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{request.unit}</div>
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          {request.category}
                        </td>
                        <td style={{
                          padding: '14px 16px'
                        }}>
                          {getPriorityBadge(request.priority)}
                        </td>
                        <td style={{
                          padding: '14px 16px'
                        }}>
                          {getStatusBadge(request.status)}
                        </td>
                        <td style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          color: '#64748b',
                          whiteSpace: 'nowrap'
                        }}>
                          {request.dueOn || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenancePage;
