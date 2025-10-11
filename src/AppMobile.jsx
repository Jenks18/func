import React, { useState, useEffect } from 'react';
import LeasesFilesPage from './pages/LeasesFilesPageNew';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import IncomePage from './pages/IncomePage';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import ExpensesPage from './pages/ExpensesPage';

// Mobile Properties Component
const MobilePropertiesPage = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 480,
    isTablet: window.innerWidth > 480 && window.innerWidth <= 1024,
    isLargeTablet: window.innerWidth > 768 && window.innerWidth <= 1024
  });

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isPhone: width <= 480,
        isTablet: width > 480 && width <= 1024,
        isLargeTablet: width > 768 && width <= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const propertiesData = [
    {
      id: 1,
      name: '2 A2 | 2',
      address: 'New York State Thruway, xsa',
      tenants: 2,
      units: 0,
      color: '#10b981'
    },
    {
      id: 2,
      name: '211 Loraine | 5',
      address: '211 Loraine, Cincinnati',
      tenants: 5,
      units: 4,
      color: '#f59e0b'
    },
    {
      id: 3,
      name: '226 W. McMillan St. | 4',
      address: '226 W. McMillan St., Cincinnati',
      tenants: 6,
      units: 1,
      color: '#3b82f6'
    },
    {
      id: 4,
      name: '2308 Gladstone Av.',
      address: '2308 Gladstone Ave., Cincinnati',
      tenants: 2,
      units: 1,
      color: '#06b6d4'
    }
  ];

  const getResponsivePadding = () => {
    if (screenSize.isLargeTablet) return '24px';
    if (screenSize.isTablet) return '20px';
    return '16px';
  };

  const getStatsGridColumns = () => {
    if (screenSize.isLargeTablet) return 'repeat(3, 1fr)';
    return 'repeat(3, 1fr)';
  };

  const getPropertiesGridColumns = () => {
    if (screenSize.isLargeTablet) return 'repeat(2, 1fr)';
    return '1fr';
  };

  return (
    <div style={{
      padding: getResponsivePadding(),
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      minHeight: '100vh',
      maxWidth: screenSize.isLargeTablet ? '1200px' : 'none',
      margin: screenSize.isLargeTablet ? '0 auto' : '0',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '0 4px',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1,
          minWidth: 0
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#1e40af',
            padding: '8px',
            flexShrink: 0
          }}>
            ←
          </button>
          <h1 style={{
            fontSize: screenSize.isLargeTablet ? '20px' : '18px',
            fontWeight: '600',
            color: '#1e40af',
            margin: 0,
            letterSpacing: '0.5px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            PROPERTIES
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#3b82f6',
            padding: '8px'
          }}>
            ⊙
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#1e40af',
            padding: '8px'
          }}>
            ☰
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: getStatsGridColumns(),
        gap: screenSize.isLargeTablet ? '16px' : '12px',
        marginBottom: screenSize.isLargeTablet ? '32px' : '24px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
          padding: screenSize.isLargeTablet ? '20px' : '14px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
          border: '1px solid #bfdbfe',
          minWidth: 0
        }}>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '13px' : '11px',
            color: '#60a5fa',
            marginBottom: '4px',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Vacant Units
          </div>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '28px' : '22px',
            fontWeight: '700',
            color: '#0284c7'
          }}>
            164
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
          padding: screenSize.isLargeTablet ? '20px' : '14px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
          border: '1px solid #bfdbfe',
          minWidth: 0
        }}>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '13px' : '11px',
            color: '#60a5fa',
            marginBottom: '4px',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Overdue
          </div>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '28px' : '22px',
            fontWeight: '700',
            color: '#ef4444'
          }}>
            116
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
          padding: screenSize.isLargeTablet ? '20px' : '14px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
          border: '1px solid #bfdbfe',
          minWidth: 0
        }}>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '13px' : '11px',
            color: '#60a5fa',
            marginBottom: '4px',
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Maintenance
          </div>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '28px' : '22px',
            fontWeight: '700',
            color: '#3b82f6'
          }}>
            43
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: getPropertiesGridColumns(),
        gap: screenSize.isLargeTablet ? '16px' : '12px',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        {propertiesData.map((property, index) => (
          <div key={property.id} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
            padding: screenSize.isLargeTablet ? '18px' : '14px',
            boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
            borderLeft: `4px solid ${property.color}`,
            border: '1px solid #bfdbfe',
            borderLeft: `4px solid ${property.color}`,
            position: 'relative',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: screenSize.isLargeTablet ? '14px' : '10px',
              width: '100%',
              overflow: 'hidden'
            }}>
              {/* Property Icon */}
              <div style={{
                width: screenSize.isLargeTablet ? '56px' : '44px',
                height: screenSize.isLargeTablet ? '56px' : '44px',
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                borderRadius: screenSize.isLargeTablet ? '12px' : '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: screenSize.isLargeTablet ? '22px' : '18px',
                flexShrink: 0,
                border: '1px solid #93c5fd',
                color: '#1e40af'
              }}>
                ⌂
              </div>
              
              {/* Property Info */}
              <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <h3 style={{
                  fontSize: screenSize.isLargeTablet ? '17px' : '15px',
                  fontWeight: '600',
                  color: '#1e40af',
                  margin: 0,
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {property.name}
                </h3>
                <p style={{
                  fontSize: screenSize.isLargeTablet ? '14px' : '12px',
                  color: '#60a5fa',
                  margin: 0,
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {property.address}
                </p>
                
                {/* Stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: screenSize.isLargeTablet ? '16px' : '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: screenSize.isLargeTablet ? '14px' : '12px',
                    color: '#3b82f6'
                  }}>
                    <span>◯</span>
                    <span>{property.tenants}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: screenSize.isLargeTablet ? '14px' : '12px',
                    color: '#3b82f6'
                  }}>
                    <span>⌂</span>
                    <span>{property.units}</span>
                  </div>
                </div>
              </div>
              
              {/* Add Button for last item */}
              {index === propertiesData.length - 1 && (
                <button style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: screenSize.isLargeTablet ? '18px' : '14px',
                  width: screenSize.isLargeTablet ? '38px' : '30px',
                  height: screenSize.isLargeTablet ? '38px' : '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: screenSize.isLargeTablet ? '18px' : '16px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(59,130,246,0.3)'
                }}>
                  +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile Dashboard Component
const MobileDashboardPage = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 480,
    isTablet: window.innerWidth > 480 && window.innerWidth <= 1024,
    isLargeTablet: window.innerWidth > 768 && window.innerWidth <= 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isPhone: width <= 480,
        isTablet: width > 480 && width <= 1024,
        isLargeTablet: width > 768 && width <= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    { label: 'Total Income', value: '$24,500', icon: '↑', color: '#0284c7' },
    { label: 'Total Expenses', value: '$8,200', icon: '↓', color: '#ef4444' },
    { label: 'Net Profit', value: '$16,300', icon: '📈', color: '#10b981' },
    { label: 'Properties', value: '12', icon: '⌂', color: '#3b82f6' }
  ];

  return (
    <div style={{
      padding: screenSize.isLargeTablet ? '24px' : '16px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h1 style={{
        fontSize: screenSize.isLargeTablet ? '28px' : '24px',
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        Dashboard
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isLargeTablet ? 'repeat(2, 1fr)' : '1fr',
        gap: screenSize.isLargeTablet ? '16px' : '12px',
        marginBottom: '24px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
            padding: screenSize.isLargeTablet ? '20px' : '16px',
            boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
            border: '1px solid #bfdbfe',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: screenSize.isLargeTablet ? '13px' : '12px',
                  color: '#60a5fa',
                  marginBottom: '8px',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: screenSize.isLargeTablet ? '26px' : '22px',
                  fontWeight: '700',
                  color: stat.color,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {stat.value}
                </div>
              </div>
              <div style={{
                fontSize: screenSize.isLargeTablet ? '32px' : '28px',
                flexShrink: 0
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
        borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
        padding: screenSize.isLargeTablet ? '20px' : '16px',
        boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
        border: '1px solid #bfdbfe',
        overflow: 'hidden'
      }}>
        <h2 style={{
          fontSize: screenSize.isLargeTablet ? '18px' : '16px',
          fontWeight: '600',
          color: '#1e40af',
          marginBottom: '16px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          Recent Activity
        </h2>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {['Payment received - $1,200', 'New tenant added', 'Maintenance request'].map((activity, i) => (
            <div key={i} style={{
              padding: screenSize.isLargeTablet ? '14px' : '12px',
              background: '#f0f9ff',
              borderRadius: '8px',
              fontSize: screenSize.isLargeTablet ? '14px' : '13px',
              color: '#1e40af',
              border: '1px solid #e0f2fe',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mobile Notifications Component
const MobileNotificationsPage = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 480,
    isTablet: window.innerWidth > 480 && window.innerWidth <= 1024,
    isLargeTablet: window.innerWidth > 768 && window.innerWidth <= 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isPhone: width <= 480,
        isTablet: width > 480 && width <= 1024,
        isLargeTablet: width > 768 && width <= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const notifications = [
    { type: 'payment', message: 'Payment received from Unit 2A', time: '2h ago', icon: '↑', color: '#0284c7' },
    { type: 'maintenance', message: 'Maintenance request submitted', time: '5h ago', icon: '⚒', color: '#f59e0b' },
    { type: 'tenant', message: 'New tenant application', time: '1d ago', icon: '◯', color: '#3b82f6' },
    { type: 'overdue', message: 'Rent overdue - Unit 5B', time: '2d ago', icon: '⚠', color: '#ef4444' },
    { type: 'lease', message: 'Lease expiring soon', time: '3d ago', icon: '⎘', color: '#8b5cf6' }
  ];

  return (
    <div style={{
      padding: screenSize.isLargeTablet ? '24px' : '16px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h1 style={{
        fontSize: screenSize.isLargeTablet ? '28px' : '24px',
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        Notifications
      </h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: screenSize.isLargeTablet ? '14px' : '12px'
      }}>
        {notifications.map((notif, index) => (
          <div key={index} style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            borderRadius: screenSize.isLargeTablet ? '14px' : '12px',
            padding: screenSize.isLargeTablet ? '18px' : '14px',
            boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            gap: screenSize.isLargeTablet ? '14px' : '12px',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <div style={{
              width: screenSize.isLargeTablet ? '48px' : '40px',
              height: screenSize.isLargeTablet ? '48px' : '40px',
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: screenSize.isLargeTablet ? '22px' : '18px',
              flexShrink: 0,
              border: '1px solid #93c5fd'
            }}>
              {notif.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{
                fontSize: screenSize.isLargeTablet ? '15px' : '14px',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {notif.message}
              </div>
              <div style={{
                fontSize: screenSize.isLargeTablet ? '13px' : '12px',
                color: '#60a5fa'
              }}>
                {notif.time}
              </div>
            </div>
            <div style={{
              width: screenSize.isLargeTablet ? '10px' : '8px',
              height: screenSize.isLargeTablet ? '10px' : '8px',
              background: notif.color,
              borderRadius: '50%',
              flexShrink: 0
            }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mobile More Component with Drawer
const MobileMorePage = ({ onNavigate }) => {
  // Screen size detection for responsive design
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 480,
    isTablet: window.innerWidth > 480 && window.innerWidth <= 1024,
    isLargeTablet: window.innerWidth > 768 && window.innerWidth <= 1024
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        width,
        isPhone: width <= 480,
        isTablet: width > 480 && width <= 1024,
        isLargeTablet: width > 768 && width <= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getResponsivePadding = () => {
    if (screenSize.isLargeTablet) return '24px';
    if (screenSize.isTablet) return '20px';
    return '16px';
  };

  const getGridColumns = () => {
    if (screenSize.isLargeTablet) return 'repeat(3, 1fr)';
    if (screenSize.isTablet) return 'repeat(2, 1fr)';
    return 'repeat(2, 1fr)';
  };

  const moreOptions = [
    { key: 'tenants', label: 'Tenants', icon: '◯' },
    { key: 'leases', label: 'Leases & Files', icon: '⎘' },
    { key: 'income', label: 'Income', icon: '↑' },
    { key: 'expenses', label: 'Expenses', icon: '↓' },
    { key: 'settings', label: 'Settings', icon: '⚙' }
  ];

  return (
    <div style={{
      padding: getResponsivePadding(),
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      minHeight: '100vh',
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h1 style={{
        fontSize: screenSize.isLargeTablet ? '28px' : '24px',
        fontWeight: '700',
        color: '#1e40af',
        marginBottom: screenSize.isLargeTablet ? '24px' : '20px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        More
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        gap: screenSize.isLargeTablet ? '16px' : '12px'
      }}>
        {moreOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onNavigate(option.key)}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
              padding: screenSize.isLargeTablet ? '22px' : '18px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(59,130,246,0.08)',
              transition: 'transform 0.2s ease',
              minHeight: screenSize.isLargeTablet ? '110px' : '95px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 0,
              overflow: 'hidden'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{
              fontSize: screenSize.isLargeTablet ? '34px' : '30px',
              marginBottom: screenSize.isLargeTablet ? '10px' : '8px'
            }}>
              {option.icon}
            </div>
            <div style={{
              fontSize: screenSize.isLargeTablet ? '15px' : '13px',
              fontWeight: '600',
              color: '#1e40af',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%'
            }}>
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function AppMobile() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  // Screen size detection for responsive design
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    isPhone: window.innerWidth <= 480,
    isTablet: window.innerWidth > 480 && window.innerWidth <= 1024,
    isLargeTablet: window.innerWidth > 768 && window.innerWidth <= 1024
  });

  // Check screen size
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 1024);
      setScreenSize({
        width,
        isPhone: width <= 480,
        isTablet: width > 480 && width <= 1024,
        isLargeTablet: width > 768 && width <= 1024
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (page) => {
    setActiveTab(page);
  };

  const tabItems = [
    { key: 'home', label: 'Home', icon: '▢' },
    { key: 'properties', label: 'Properties', icon: '⌂' },
    { key: 'notifications', label: 'Notifications', icon: '🔔' },
    { key: 'more', label: 'More', icon: '☰' }
  ];

  if (!isMobile) {
    // Return desktop version for larger screens
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        background: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Mobile View
          </h2>
          <p style={{
            color: '#6b7280',
            margin: 0
          }}>
            Please resize your browser window to mobile size (768px or less) to see the mobile interface.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        paddingBottom: screenSize.isLargeTablet ? '104px' : screenSize.isTablet ? '96px' : '88px', // Space for bottom navigation
        WebkitOverflowScrolling: 'touch',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        {activeTab === 'home' && <MobileDashboardPage />}
        {activeTab === 'properties' && <MobilePropertiesPage />}
        {activeTab === 'notifications' && <MobileNotificationsPage />}
        {activeTab === 'more' && <MobileMorePage onNavigate={handleNavigation} />}
        {activeTab === 'tenants' && <TenantsPage />}
        {activeTab === 'leases' && <LeasesFilesPage />}
        {activeTab === 'income' && <IncomePage />}
        {activeTab === 'expenses' && <ExpensesPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.98) 100%)',
        borderTop: '1px solid #bfdbfe',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: screenSize.isLargeTablet ? '10px 0' : screenSize.isTablet ? '8px 0' : '6px 0',
        height: screenSize.isLargeTablet ? '80px' : screenSize.isTablet ? '72px' : '68px',
        zIndex: 1000,
        boxShadow: '0 -2px 8px rgba(59,130,246,0.1)',
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        {tabItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: screenSize.isLargeTablet ? '5px' : '3px',
              padding: screenSize.isLargeTablet ? '10px 14px' : screenSize.isTablet ? '8px 12px' : '6px 10px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              position: 'relative',
              minWidth: screenSize.isLargeTablet ? '70px' : '55px',
              flex: 1,
              maxWidth: screenSize.isLargeTablet ? '90px' : '75px'
            }}
          >
            <div style={{
              fontSize: screenSize.isLargeTablet ? '22px' : '18px',
              opacity: activeTab === item.key ? 1 : 0.6
            }}>
              {item.icon}
            </div>
            <div style={{
              fontSize: screenSize.isLargeTablet ? '12px' : '10px',
              fontWeight: activeTab === item.key ? '600' : '400',
              color: activeTab === item.key ? '#3b82f6' : '#60a5fa',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              textAlign: 'center'
            }}>
              {item.label}
            </div>
            {item.key === 'notifications' && (
              <div style={{
                position: 'absolute',
                top: screenSize.isLargeTablet ? '6px' : '4px',
                right: screenSize.isLargeTablet ? '14px' : '10px',
                width: screenSize.isLargeTablet ? '18px' : '16px',
                height: screenSize.isLargeTablet ? '18px' : '16px',
                background: '#ef4444',
                borderRadius: '50%',
                fontSize: screenSize.isLargeTablet ? '11px' : '9px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600'
              }}>
                5
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
