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
      background: '#f8fafc',
      minHeight: '100vh',
      maxWidth: screenSize.isLargeTablet ? '1200px' : 'none',
      margin: screenSize.isLargeTablet ? '0 auto' : '0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding: '0 4px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}>
            ←
          </button>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            margin: 0,
            letterSpacing: '0.5px'
          }}>
            PROPERTIES
          </h1>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#3b82f6'
          }}>
            🔍
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}>
            ⋮
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: getStatsGridColumns(),
        gap: screenSize.isLargeTablet ? '16px' : '12px',
        marginBottom: screenSize.isLargeTablet ? '32px' : '24px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
          padding: screenSize.isLargeTablet ? '24px' : '16px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '14px' : '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Vacant Units
          </div>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '32px' : '24px',
            fontWeight: '700',
            color: '#10b981'
          }}>
            164
          </div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
          padding: screenSize.isLargeTablet ? '24px' : '16px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '14px' : '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            Overdue Units
          </div>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '32px' : '24px',
            fontWeight: '700',
            color: '#ef4444'
          }}>
            116
          </div>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
          padding: screenSize.isLargeTablet ? '24px' : '16px',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '14px' : '12px',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            In Maintenance
          </div>
          <div style={{
            fontSize: screenSize.isLargeTablet ? '32px' : '24px',
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
        gap: screenSize.isLargeTablet ? '16px' : '12px'
      }}>
        {propertiesData.map((property, index) => (
          <div key={property.id} style={{
            background: 'white',
            borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
            padding: screenSize.isLargeTablet ? '20px' : '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderLeft: `4px solid ${property.color}`,
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: screenSize.isLargeTablet ? '16px' : '12px'
            }}>
              {/* Property Icon */}
              <div style={{
                width: screenSize.isLargeTablet ? '60px' : '48px',
                height: screenSize.isLargeTablet ? '60px' : '48px',
                background: '#f0f9ff',
                borderRadius: screenSize.isLargeTablet ? '12px' : '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: screenSize.isLargeTablet ? '24px' : '20px'
              }}>
                🏢
              </div>
              
              {/* Property Info */}
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: screenSize.isLargeTablet ? '18px' : '16px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {property.name}
                </h3>
                <p style={{
                  fontSize: screenSize.isLargeTablet ? '16px' : '14px',
                  color: '#6b7280',
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  {property.address}
                </p>
                
                {/* Stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: screenSize.isLargeTablet ? '20px' : '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: screenSize.isLargeTablet ? '16px' : '14px',
                    color: '#6b7280'
                  }}>
                    <span>👥</span>
                    <span>{property.tenants}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: screenSize.isLargeTablet ? '16px' : '14px',
                    color: '#6b7280'
                  }}>
                    <span>🏠</span>
                    <span>{property.units}</span>
                  </div>
                </div>
              </div>
              
              {/* Add Button for last item */}
              {index === propertiesData.length - 1 && (
                <button style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: screenSize.isLargeTablet ? '20px' : '16px',
                  width: screenSize.isLargeTablet ? '40px' : '32px',
                  height: screenSize.isLargeTablet ? '40px' : '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  border: 'none',
                  color: 'white',
                  fontSize: screenSize.isLargeTablet ? '20px' : '18px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
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
  return (
    <div style={{
      padding: '16px',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#374151',
        marginBottom: '20px'
      }}>
        Dashboard
      </h1>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Mobile dashboard content coming soon...
        </p>
      </div>
    </div>
  );
};

// Mobile Notifications Component
const MobileNotificationsPage = () => {
  return (
    <div style={{
      padding: '16px',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#374151',
        marginBottom: '20px'
      }}>
        Notifications
      </h1>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '12px'
        }}>
          🔔
        </div>
        <p style={{ color: '#6b7280', margin: 0 }}>
          No new notifications
        </p>
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
    { key: 'tenants', label: 'Tenants', icon: '👥' },
    { key: 'leases', label: 'Leases & Files', icon: '📄' },
    { key: 'income', label: 'Income', icon: '💰' },
    { key: 'expenses', label: 'Expenses', icon: '💳' },
    { key: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div style={{
      padding: getResponsivePadding(),
      background: '#f8fafc',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <h1 style={{
        fontSize: screenSize.isLargeTablet ? '28px' : '24px',
        fontWeight: '700',
        color: '#374151',
        marginBottom: screenSize.isLargeTablet ? '24px' : '20px'
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
              background: 'white',
              border: 'none',
              borderRadius: screenSize.isLargeTablet ? '16px' : '12px',
              padding: screenSize.isLargeTablet ? '24px' : '20px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease',
              minHeight: screenSize.isLargeTablet ? '120px' : '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
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
              fontSize: screenSize.isLargeTablet ? '36px' : '32px',
              marginBottom: screenSize.isLargeTablet ? '12px' : '8px'
            }}>
              {option.icon}
            </div>
            <div style={{
              fontSize: screenSize.isLargeTablet ? '16px' : '14px',
              fontWeight: '500',
              color: '#374151'
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
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'properties', label: 'Properties', icon: '🏢' },
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
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        paddingBottom: screenSize.isLargeTablet ? '104px' : screenSize.isTablet ? '96px' : '88px' // Space for bottom navigation
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
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: screenSize.isLargeTablet ? '12px 0' : screenSize.isTablet ? '10px 0' : '8px 0',
        height: screenSize.isLargeTablet ? '88px' : screenSize.isTablet ? '80px' : '72px',
        zIndex: 1000
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
              gap: screenSize.isLargeTablet ? '6px' : '4px',
              padding: screenSize.isLargeTablet ? '12px 16px' : screenSize.isTablet ? '10px 14px' : '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              position: 'relative',
              minWidth: screenSize.isLargeTablet ? '80px' : '60px'
            }}
          >
            <div style={{
              fontSize: screenSize.isLargeTablet ? '24px' : '20px',
              opacity: activeTab === item.key ? 1 : 0.6
            }}>
              {item.icon}
            </div>
            <div style={{
              fontSize: screenSize.isLargeTablet ? '13px' : '11px',
              fontWeight: activeTab === item.key ? '600' : '400',
              color: activeTab === item.key ? '#3b82f6' : '#6b7280'
            }}>
              {item.label}
            </div>
            {item.key === 'notifications' && (
              <div style={{
                position: 'absolute',
                top: screenSize.isLargeTablet ? '8px' : '6px',
                right: screenSize.isLargeTablet ? '16px' : '12px',
                width: screenSize.isLargeTablet ? '10px' : '8px',
                height: screenSize.isLargeTablet ? '10px' : '8px',
                background: '#ef4444',
                borderRadius: '50%',
                fontSize: screenSize.isLargeTablet ? '12px' : '10px',
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
