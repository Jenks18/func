import React, { useState } from 'react';

export default function LeaseDetailView({ 
  selectedLease, 
  allLeases, 
  onLeaseSelect, 
  onClose,
  isMobile 
}) {
  // Toggle states for collapsible sections
  const [isOpenDocsExpanded, setIsOpenDocsExpanded] = useState(true);
  const [isLeaseDocExpanded, setIsLeaseDocExpanded] = useState(true);
  const [isLeaseHistoryExpanded, setIsLeaseHistoryExpanded] = useState(true);
  
  // Helper function to get consistent tenant data
  const getTenantData = (index) => {
    const names = ['James McCroy', 'Sarah Johnson', 'Mike Davis'];
    const emails = ['james.mccroy@email.com', 'sarah.j@email.com', 'mike.d@email.com'];
    const initials = ['JM', 'SJ', 'MD'];
    const colors = ['#14b8a6', '#06b6d4', '#8b5cf6']; // Teal, cyan, purple
    
    return {
      name: names[index] || names[0],
      email: emails[index] || emails[0],
      initials: initials[index] || initials[0],
      color: colors[index] || colors[0]
    };
  };
  
  return (
    <div style={{
      display: 'flex',
      gap: '0',
      height: 'calc(100vh - 280px)',
      maxHeight: 'calc(100vh - 280px)',
      overflow: 'hidden',
      borderRadius: '16px',
      border: '1px solid #99f6e4',
      boxShadow: '0 4px 16px rgba(20,184,166,0.1)',
      width: '100%'
    }}>
      {/* Left side - Compressed lease list (280px fixed) */}
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
            FILTER
          </div>
          <div style={{
            fontSize: '13px',
            color: '#134e4a',
            fontWeight: '600'
          }}>
            Showing {allLeases.length} of {allLeases.length}
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
                  background: '#f0fdfa',
                  position: 'sticky',
                  top: 0
                }}>
                  STATUS
                </th>
                <th style={{
                  padding: '8px 10px',
                  textAlign: 'left',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#0f766e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: '#f0fdfa',
                  position: 'sticky',
                  top: 0
                }}>
                  PROPERTY
                </th>
                <th style={{
                  padding: '8px 10px',
                  textAlign: 'left',
                  fontSize: '9px',
                  fontWeight: '700',
                  color: '#0f766e',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: '50px',
                  background: '#f0fdfa',
                  position: 'sticky',
                  top: 0
                }}>
                  UNIT
                </th>
              </tr>
            </thead>
            <tbody>
              {allLeases.map((lease) => (
                <tr 
                  key={lease.id}
                  onClick={() => onLeaseSelect(lease)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <td style={{ 
                    padding: '10px',
                    background: selectedLease.id === lease.id ? '#ccfbf1' : 'white',
                    borderLeft: selectedLease.id === lease.id ? '3px solid #14b8a6' : '3px solid transparent',
                    borderTop: '1px solid #f3f4f6',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <span style={{
                      background: lease.status === 'Active' ? '#dcfce7' : 
                                  lease.status === 'In Process' ? '#dbeafe' :
                                  lease.status === 'Expired' ? '#fee2e2' : '#f3f4f6',
                      color: lease.status === 'Active' ? '#16a34a' : 
                             lease.status === 'In Process' ? '#2563eb' :
                             lease.status === 'Expired' ? '#dc2626' : '#6b7280',
                      padding: '3px 7px',
                      borderRadius: '10px',
                      fontSize: '8px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}>
                      {lease.status === 'In Process' ? 'PROCESS' : lease.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{
                    padding: '10px',
                    color: '#134e4a',
                    fontSize: '11px',
                    fontWeight: '600',
                    maxWidth: '110px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    background: selectedLease.id === lease.id ? '#ccfbf1' : 'white',
                    borderTop: '1px solid #f3f4f6',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    {lease.property}
                  </td>
                  <td style={{
                    padding: '10px',
                    color: '#14b8a6',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: selectedLease.id === lease.id ? '#ccfbf1' : 'white',
                    borderRight: selectedLease.id === lease.id ? '3px solid transparent' : 'none',
                    borderTop: '1px solid #f3f4f6',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    {lease.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right side - Full Detail View (flex: 1 takes remaining space) */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ecfdf5 100%)',
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Lease Detail Header - Fixed */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
          borderBottom: '2px solid #99f6e4',
          padding: '20px 32px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#115e59',
              margin: 0
            }}>
              Lease Detail
            </h2>
            <div style={{
              fontSize: '13px',
              color: '#14b8a6',
              marginTop: '4px',
              fontWeight: '500'
            }}>
              {selectedLease.property} | Unit {selectedLease.unit}
            </div>
          </div>
          
          <button
            onClick={onClose}
            style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
              border: '2px solid #99f6e4',
              color: '#0f766e',
              cursor: 'pointer',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: '600',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)';
              e.target.style.color = '#115e59';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
              e.target.style.color = '#0f766e';
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{
          flex: 1, 
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 32px'
        }}>
          {/* Top Info Card - 3 Sections */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '2px solid #99f6e4',
            marginBottom: '20px',
            overflow: 'hidden',
            display: 'flex',
            boxShadow: '0 4px 16px rgba(20,184,166,0.1)'
          }}>
            {/* Section 1: Property & Status */}
            <div style={{
              flex: 1,
              padding: '20px 24px',
              borderRight: '2px solid #ccfbf1',
              background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)'
            }}>
              <div style={{
                fontSize: '11px',
                color: '#0f766e',
                marginBottom: '8px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Property
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#115e59',
                marginBottom: '12px'
              }}>
                {selectedLease.property} | {selectedLease.unit}
              </div>
              <span style={{
                background: selectedLease.status === 'Active' ? 
                  'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : 
                  selectedLease.status === 'In Process' ? 
                  'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' : 
                  'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                color: selectedLease.status === 'Active' ? '#065f46' : 
                       selectedLease.status === 'In Process' ? '#1e40af' : '#991b1b',
                fontSize: '11px',
                padding: '6px 14px',
                borderRadius: '14px',
                fontWeight: '700',
                display: 'inline-block',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: selectedLease.status === 'Active' ? '2px solid #6ee7b7' :
                        selectedLease.status === 'In Process' ? '2px solid #93c5fd' : '2px solid #fca5a5'
              }}>
                {selectedLease.status}
              </span>
            </div>

            {/* Section 2: Lease Type & Rent */}
            <div style={{
              flex: 1,
              padding: '20px 24px',
              borderRight: '2px solid #ccfbf1',
              background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)'
            }}>
              <div style={{
                fontSize: '11px',
                color: '#0f766e',
                marginBottom: '8px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {selectedLease.start} - M to M
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '6px'
              }}>
                {selectedLease.rent}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#0f766e',
                fontWeight: '500'
              }}>
                Monthly Rent · Due on the 1st of every month
              </div>
            </div>

            {/* Section 3: Tenants */}
            <div style={{
              flex: 1,
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(180deg, #ffffff 0%, #f0fdfa 100%)'
            }}>
              <div>
                <div style={{
                  fontSize: '11px',
                  color: '#0f766e',
                  marginBottom: '12px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Tenants of this property
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Tenant avatar circles - Use consistent tenant data */}
                  {[...Array(selectedLease.tenants || 1)].map((_, i) => {
                    const tenant = getTenantData(i);
                    return (
                      <div
                        key={i}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: tenant.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: 'white',
                          border: '3px solid white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          marginLeft: i > 0 ? '-12px' : '0',
                          transition: 'transform 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        title={tenant.name}
                      >
                        {tenant.initials}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Three-dot menu */}
              <button style={{
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                border: '2px solid #99f6e4',
                cursor: 'pointer',
                padding: '8px 12px',
                fontSize: '20px',
                color: '#0f766e',
                fontWeight: 'bold',
                lineHeight: '1',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)';
                e.target.style.color = '#115e59';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
                e.target.style.color = '#0f766e';
              }}
              >
                ⋯
              </button>
            </div>
          </div>

          {/* Open Documents Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '2px solid #99f6e4',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(20,184,166,0.08)'
          }}>
            {/* Section Header - Collapsible */}
            <div 
              onClick={() => setIsOpenDocsExpanded(!isOpenDocsExpanded)}
              style={{
                padding: '18px 24px',
                borderBottom: isOpenDocsExpanded ? '2px solid #ccfbf1' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ 
                  fontSize: '16px', 
                  color: '#14b8a6',
                  transition: 'transform 0.2s ease',
                  display: 'inline-block',
                  transform: isOpenDocsExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                }}>▼</span>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#115e59',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  OPEN DOCUMENTS (1)
                </h3>
              </div>
            </div>

            {/* Document Item - Collapsible */}
            {isOpenDocsExpanded && (
              <div style={{ padding: '16px 20px' }}>
                {/* Lease Document Header */}
                <div 
                  onClick={() => setIsLeaseDocExpanded(!isLeaseDocExpanded)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: isLeaseDocExpanded ? '16px' : '0',
                    cursor: 'pointer',
                    padding: '8px 0'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#6b7280',
                      transition: 'transform 0.2s ease',
                      display: 'inline-block',
                      transform: isLeaseDocExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                    }}>▼</span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      LEASE DOCUMENT
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      1 Tenant
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle sign now action
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                      color: 'white',
                      border: '2px solid #14b8a6',
                      borderRadius: '8px',
                      padding: '8px 20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(20,184,166,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(20,184,166,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(20,184,166,0.3)';
                    }}
                  >
                    Sign Now
                  </button>
                </div>

                {/* Tenant Row - Collapsible */}
                {isLeaseDocExpanded && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 2fr 2fr 1fr',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
                    borderRadius: '12px',
                    border: '1px solid #ccfbf1'
                  }}>
                {/* Tenant Info - Use same tenant data as top section */}
                {(() => {
                  const tenant = getTenantData(0); // First tenant
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: tenant.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'white',
                        border: '3px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        {tenant.initials}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#115e59'
                        }}>
                          {tenant.name}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#14b8a6'
                        }}>
                          {tenant.email}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Last Activity */}
                <div>
                  <div style={{
                    fontSize: '11px',
                    color: '#0f766e',
                    marginBottom: '4px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Last Activity
                  </div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#115e59'
                  }}>
                    Jan 30, 2025 | 9:05 AM
                  </div>
                </div>

                {/* Status Timeline */}
                <div>
                  <div style={{
                    fontSize: '11px',
                    color: '#0f766e',
                    marginBottom: '6px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Status
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: '2px solid #d1fae5',
                        boxShadow: '0 2px 4px rgba(16,185,129,0.3)'
                      }} />
                      <div style={{
                        fontSize: '9px',
                        color: '#14b8a6',
                        fontWeight: '600'
                      }}>
                        Sent
                      </div>
                    </div>
                    <div style={{ width: '20px', height: '2px', background: '#99f6e4' }} />
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: '2px solid #d1fae5',
                        boxShadow: '0 2px 4px rgba(16,185,129,0.3)'
                      }} />
                      <div style={{
                        fontSize: '9px',
                        color: '#14b8a6',
                        fontWeight: '600'
                      }}>
                        Viewed
                      </div>
                    </div>
                    <div style={{ width: '20px', height: '2px', background: '#99f6e4' }} />
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#e5e7eb',
                        border: '2px solid #d1d5db'
                      }} />
                      <div style={{
                        fontSize: '9px',
                        color: '#9ca3af',
                        fontWeight: '600'
                      }}>
                        Signed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insurance Status - Aligned on one line */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#0f766e',
                    whiteSpace: 'nowrap',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Insurance
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#dc2626',
                    background: '#fee2e2',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #fca5a5'
                  }}>
                    Not Requested
                  </div>
                  <a href="#" style={{
                    fontSize: '11px',
                    color: '#14b8a6',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    fontWeight: '600',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#0d9488'}
                  onMouseOut={(e) => e.target.style.color = '#14b8a6'}
                  >
                    Request Insurance →
                  </a>
                </div>

                {/* Three-dot menu */}
                <button style={{
                  background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                  border: '2px solid #99f6e4',
                  cursor: 'pointer',
                  padding: '8px 12px',
                  fontSize: '18px',
                  color: '#0f766e',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)';
                  e.target.style.color = '#115e59';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
                  e.target.style.color = '#0f766e';
                }}
                >
                  ⋯
                </button>
              </div>
            )}
          </div>
        )}
      </div>

          {/* Lease History Section */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '2px solid #99f6e4',
            marginBottom: '20px',
            boxShadow: '0 4px 12px rgba(20,184,166,0.08)'
          }}>
            {/* Section Header - Collapsible */}
            <div 
              onClick={() => setIsLeaseHistoryExpanded(!isLeaseHistoryExpanded)}
              style={{
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
                borderBottom: isLeaseHistoryExpanded ? '2px solid #ccfbf1' : 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'}
            >
              <span style={{ 
                fontSize: '16px', 
                color: '#14b8a6',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
                transform: isLeaseHistoryExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
              }}>▼</span>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#115e59',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                LEASE HISTORY
              </h3>
            </div>

            {/* History Items - Collapsible */}
            {isLeaseHistoryExpanded && (
              <div style={{ padding: '20px 24px' }}>
                <div style={{
                  padding: '16px',
                  borderBottom: '2px solid #f0fdfa',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#115e59',
                    marginBottom: '6px'
                  }}>
                    Lease Created
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#14b8a6',
                    fontWeight: '500'
                  }}>
                    May 15, 2023 | 1:37 PM by System
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
