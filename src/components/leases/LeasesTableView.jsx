import React from 'react';

export default function LeasesTableView({ 
  leases, 
  isLoading, 
  error, 
  sortField, 
  sortDirection, 
  onSort, 
  onLeaseSelect,
  onNewLease,
  isMobile 
}) {
  
  if (isLoading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #99f6e4',
        boxShadow: '0 4px 16px rgba(20,184,166,0.2)',
        padding: '48px 24px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '48px', 
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}>
          ⏳
        </div>
        <div style={{
          fontSize: '18px',
          color: '#0f766e',
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          Loading leases...
        </div>
        <div style={{ fontSize: '14px', color: '#14b8a6', fontWeight: '600' }}>
          Fetching data from database
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '2px solid #fecaca',
        boxShadow: '0 4px 16px rgba(239,68,68,0.2)',
        padding: '48px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
        <div style={{ fontSize: '18px', color: '#dc2626', fontWeight: '700', marginBottom: '8px' }}>
          Error loading leases
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', fontWeight: '500' }}>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (leases.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1px solid #99f6e4',
        boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
        padding: '48px 24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>📄</div>
        <div style={{ fontSize: '18px', color: '#134e4a', fontWeight: '600', marginBottom: '8px' }}>
          No leases found
        </div>
        <div style={{ fontSize: '14px', color: '#14b8a6' }}>
          Create your first lease to get started
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      gap: '20px'
    }}>
      {/* Left side - Table */}
      <div style={{ flex: 1 }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #99f6e4',
          boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
          overflow: 'hidden'
        }}>
          {isMobile ? (
            /* Mobile Card View */
            <div style={{ padding: '12px' }}>
              {leases.map((lease) => (
                <div
                  key={lease.id}
                  onClick={() => onLeaseSelect(lease)}
                  style={{
                    background: '#f0fdfa',
                    border: '1px solid #99f6e4',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#134e4a', marginBottom: '12px' }}>
                    {lease.property} - Unit {lease.unit}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Status</div>
                      <span style={{
                        background: lease.status === 'Active' ? '#dcfce7' : '#fee2e2',
                        color: lease.status === 'Active' ? '#16a34a' : '#dc2626',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        display: 'inline-block'
                      }}>
                        {lease.status}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Rent</div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>{lease.rent}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '2px' }}>Tenants</div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>{lease.tenants}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Desktop Table View */
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                  borderBottom: '2px solid #14b8a6'
                }}>
                  <th onClick={() => onSort('status')} style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#0f766e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Status
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', fontSize: '8px', lineHeight: '6px' }}>
                        <span style={{ color: sortField === 'status' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1' }}>▲</span>
                        <span style={{ color: sortField === 'status' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1' }}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th onClick={() => onSort('property')} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Property
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', fontSize: '8px', lineHeight: '6px' }}>
                        <span style={{ color: sortField === 'property' && sortDirection === 'asc' ? '#14b8a6' : '#cbd5e1' }}>▲</span>
                        <span style={{ color: sortField === 'property' && sortDirection === 'desc' ? '#14b8a6' : '#cbd5e1' }}>▼</span>
                      </div>
                    </div>
                  </th>
                  <th onClick={() => onSort('unit')} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', cursor: 'pointer' }}>Unit</th>
                  <th onClick={() => onSort('address')} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', cursor: 'pointer' }}>Address</th>
                  <th onClick={() => onSort('tenants')} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', cursor: 'pointer' }}>Tenants</th>
                  <th onClick={() => onSort('start')} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', cursor: 'pointer' }}>Start</th>
                  <th onClick={() => onSort('end')} style={{ padding: '16px 20px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', cursor: 'pointer' }}>End</th>
                </tr>
              </thead>
              <tbody>
                {leases.map((lease) => (
                  <tr 
                    key={lease.id} 
                    onClick={() => onLeaseSelect(lease)}
                    style={{
                      borderBottom: '1px solid #f0fdfa',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f0fdfa'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        background: lease.status === 'Active' ? '#dcfce7' : lease.status === 'In Process' ? '#dbeafe' : '#fee2e2',
                        color: lease.status === 'Active' ? '#16a34a' : lease.status === 'In Process' ? '#2563eb' : '#dc2626',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        display: 'inline-block'
                      }}>
                        {lease.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#134e4a', fontSize: '14px', fontWeight: '600' }}>
                      {lease.property}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#14b8a6', fontSize: '14px', fontWeight: '700' }}>
                      {lease.unit}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '13px' }}>
                      {lease.address || '3336 Jefferson Ave, Cincinnati, Ohio 45220'}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#374151', fontSize: '14px' }}>
                      {lease.tenants}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '13px' }}>
                      {lease.start}
                    </td>
                    <td style={{ padding: '16px 20px', color: '#6b7280', fontSize: '13px' }}>
                      {lease.end}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Right side - Summary Cards */}
      {!isMobile && (
        <div style={{
          flex: '0 0 22%',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minWidth: '200px'
        }}>
          {/* Active Leases Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(20,184,166,0.1)'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#14b8a6',
              marginBottom: '4px'
            }}>
              {leases.filter(l => l.status === 'Active').length}
            </div>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              ACTIVE LEASES
            </div>
          </div>

          {/* In Process Leases Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(20,184,166,0.1)'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#14b8a6',
              marginBottom: '4px'
            }}>
              {leases.filter(l => l.status === 'In Process').length}
            </div>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              IN PROCESS LEASES
            </div>
          </div>

          {/* Future Leases Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(20,184,166,0.1)'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#14b8a6',
              marginBottom: '4px'
            }}>
              {leases.filter(l => new Date(l.start) > new Date()).length}
            </div>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              FUTURE LEASES
            </div>
          </div>

          {/* Expiring Soon Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(20,184,166,0.1)'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#14b8a6',
              marginBottom: '4px'
            }}>
              {leases.filter(l => {
                const endDate = new Date(l.end);
                const today = new Date();
                const thirtyDaysFromNow = new Date();
                thirtyDaysFromNow.setDate(today.getDate() + 30);
                return endDate > today && endDate <= thirtyDaysFromNow;
              }).length}
            </div>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              EXPIRING SOON
            </div>
          </div>

          {/* Expired Leases Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #99f6e4',
            padding: '16px 20px',
            boxShadow: '0 2px 8px rgba(20,184,166,0.1)'
          }}>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#14b8a6',
              marginBottom: '4px'
            }}>
              {leases.filter(l => {
                const endDate = new Date(l.end);
                const today = new Date();
                return endDate < today;
              }).length}
            </div>
            <div style={{
              fontSize: '9px',
              fontWeight: '600',
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              EXPIRED LEASES
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
