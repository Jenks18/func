import React from 'react';

const DashboardPage = ({ onNavigate }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '100%',
      padding: '24px',
      background: 'transparent',
      minHeight: '100vh',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 14px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📄 Record Payment
          </button>
          <button
            onClick={() => onNavigate && onNavigate('leases')}
            style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            👤 Add Tenant
          </button>
        </div>
      </div>

      {/* Collection Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            Collection - May
          </h2>
          <select style={{
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#334155'
          }}>
            <option>May 2023</option>
          </select>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px 1fr',
          gap: '32px',
          alignItems: 'center'
        }}>
          {/* Outstanding */}
          <div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Outstanding
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ef4444',
              marginBottom: '4px'
            }}>
              $1,050.00
            </div>
            <div style={{
              fontSize: '12px',
              color: '#ef4444',
              fontWeight: '500'
            }}>
              24% UNPAID
            </div>
          </div>

          {/* Circular Progress Chart */}
          <div style={{
            position: 'relative',
            width: '200px',
            height: '200px',
            margin: '0 auto'
          }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="16"
              />
              {/* Progress circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#10b981"
                strokeWidth="16"
                strokeDasharray="502.65"
                strokeDashoffset="125.66"
                strokeLinecap="round"
              />
            </svg>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '4px'
              }}>
                May
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                2023
              </div>
            </div>
          </div>

          {/* Collected */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Collected
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '4px'
            }}>
              $3,250.00
            </div>
            <div style={{
              fontSize: '12px',
              color: '#10b981',
              fontWeight: '500'
            }}>
              76% COLLECTED
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '24px',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #f3f4f6'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Units with Invoices Due
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#374151'
            }}>
              1/2
            </div>
            <div style={{ marginTop: '8px' }}>
              🏠 <span style={{ color: '#3b82f6', fontSize: '12px', cursor: 'pointer' }}>View All</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Processing: $0.00
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Total: $4,300.00
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Past Outstanding: $0.00
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Units with Invoices Paid
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#374151'
            }}>
              1/2
            </div>
            <div style={{ marginTop: '8px' }}>
              🏠 <span style={{ color: '#3b82f6', fontSize: '12px', cursor: 'pointer' }}>View All</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Occupancy Statistics
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ef4444'
                }}>
                  2
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  Vacant
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  2
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  Occupied
                </div>
              </div>
              <div style={{
                width: '60px',
                height: '60px',
                position: 'relative'
              }}>
                <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="6"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeDasharray="157.08"
                    strokeDashoffset="78.54"
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '10px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  50%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '24px'
      }}>
        {/* Unsigned Leases */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151'
            }}>
              📄 UNSIGNED LEASES
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '120px',
            color: '#9ca3af'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              📄
            </div>
            <div style={{ fontSize: '14px' }}>
              No Records Found
            </div>
          </div>
        </div>

        {/* Applications Processing */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151'
            }}>
              📋 APPLICATIONS PROCESSING
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '120px',
            color: '#9ca3af'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              📋
            </div>
            <div style={{ fontSize: '14px' }}>
              No Records Found
            </div>
          </div>
        </div>

        {/* Open Maintenance Requests */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            🔧 OPEN MAINTENANCE REQUESTS
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '120px',
            color: '#9ca3af'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '12px'
            }}>
              🔧
            </div>
            <div style={{ fontSize: '14px' }}>
              There are no maintenance requests
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
