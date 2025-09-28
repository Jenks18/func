import React, { useState, useEffect } from 'react';
import LeasesFilesPage from './pages/LeasesFilesPageNew';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import IncomePage from './pages/IncomePage';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
import ExpensesPage from './pages/ExpensesPage';
import DatabaseTestPage from './pages/DatabaseTestPage';
import AppMobile from './AppMobile';
import dataService from './services/dataService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);

  const menuItems = [
    { name: 'Dashboard', component: 'Dashboard', icon: '🏠' },
    { name: 'Properties', component: 'Properties', icon: '🏢' },
    { name: 'Tenants', component: 'Tenants', icon: '👥' },
    { name: 'Applications', component: 'Applications', icon: '📝' },
    { name: 'Leases & Files', component: 'LeasesFiles', icon: '📄' },
    { name: 'Income', component: 'Income', icon: '💰' },
    { name: 'Expenses', component: 'Expenses', icon: '💳' },
    { name: 'Maintenance', component: 'Maintenance', icon: '🔧' },
    { name: 'Messaging', component: 'Messaging', icon: '💬' },
    { name: 'Listings', component: 'Listings', icon: '📋' }
  ];

  // Initialize database
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Initializing database...');
        await dataService.initialize();
        setIsDbInitialized(true);
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error.message);
      }
    };

    initializeDatabase();
  }, []);

  // Check screen size - now includes tablets
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Extended to include tablets
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If mobile/tablet, use mobile app
  if (isMobile) {
    return <AppMobile />;
  }

  // Show loading screen while database initializes
  if (!isDbInitialized && !dbError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b'
        }}>
          JumbaJot
        </div>
        <div style={{
          fontSize: '16px',
          color: '#64748b'
        }}>
          Initializing database...
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Show error screen if database initialization failed
  if (dbError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#dc2626'
        }}>
          Database Error
        </div>
        <div style={{
          fontSize: '16px',
          color: '#64748b',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          Failed to initialize the database: {dbError}
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const handleNavigation = (component, params = {}) => {
    setCurrentPage(component);
    // Store navigation parameters for the current page
    if (params && Object.keys(params).length > 0) {
      sessionStorage.setItem(`${component}_params`, JSON.stringify(params));
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;Let
          }
          
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%, #f8fafc 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite'
      }}>
      {/* Sidebar */}
              {/* Sidebar */}
        <div 
          style={{
            width: sidebarExpanded || sidebarHovered ? '280px' : '72px',
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            minHeight: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)'
          }}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
        >
          {/* Logo */}
          <div style={{
            padding: (sidebarExpanded || sidebarHovered) ? '24px' : '20px 0',
            borderBottom: '1px solid #334155',
            overflow: 'hidden',
            transition: 'padding 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '72px'
          }}>
            <h1 style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: 0,
              whiteSpace: 'nowrap',
              opacity: (sidebarExpanded || sidebarHovered) ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}>
              {(sidebarExpanded || sidebarHovered) ? 'JumbaJot' : ''}
            </h1>
            {!(sidebarExpanded || sidebarHovered) && (
              <div style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(59, 130, 246, 0.3)'
              }}>
                J
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav style={{ 
            flex: 1, 
            padding: '24px 0',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(item.component)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: (sidebarExpanded || sidebarHovered) ? '0 16px' : '0',
                  background: currentPage === item.component ? '#3b82f6' : 
                             (hoveredItem === index ? '#475569' : 'transparent'),
                  color: currentPage === item.component ? 'white' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span style={{ 
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </span>
                {(sidebarExpanded || sidebarHovered) && (
                  <span style={{
                    whiteSpace: 'nowrap'
                  }}>
                    {item.name}
                  </span>
                )}
              </button>
            ))}
            {/* Settings, unknown icon, and logout at the bottom */}
            <div style={{ marginTop: 'auto', padding: (sidebarExpanded || sidebarHovered) ? '0 16px 24px 16px' : '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => setCurrentPage('Settings')}
                style={{
                  width: '100%',
                  height: '48px',
                  background: currentPage === 'Settings' ? '#3b82f6' : 'transparent',
                  color: currentPage === 'Settings' ? 'white' : '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙️</span>
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
              </button>
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  color: '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❓</span>
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Unknown</span>}
              </button>
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  color: '#cbd5e1',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚪</span>
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Logout</span>}
              </button>
            </div>
          </nav>
        </div>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        marginLeft: (sidebarExpanded || sidebarHovered) ? '280px' : '72px',
        transition: 'margin-left 0.3s ease',
        overflow: 'hidden'
      }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          zIndex: 10,
          position: 'fixed',
          top: 0,
          left: (sidebarExpanded || sidebarHovered) ? '280px' : '72px',
          right: 0,
          transition: 'left 0.3s ease'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px',
                color: '#64748b',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <span style={{ fontSize: '18px' }}>☰</span>
            </button>
            <span style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b' }}>
              {menuItems.find(item => item.component === currentPage)?.name || 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              color: '#64748b'
            }}>
              🔔
            </button>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              color: '#374151',
              fontSize: '14px'
            }}>
              JM
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section style={{
          flex: 1,
          padding: '24px',
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          overflowX: 'hidden',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            minHeight: 'calc(100vh - 112px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
          {currentPage === 'LeasesFiles' ? (
            <LeasesFilesPage />
          ) : currentPage === 'Dashboard' ? (
            <DashboardPage onNavigate={handleNavigation} />
          ) : currentPage === 'Settings' ? (
            <SettingsPage />
          ) : currentPage === 'Income' ? (
            <IncomePage />
          ) : currentPage === 'Properties' ? (
            <PropertiesPage />
          ) : currentPage === 'Tenants' ? (
            <TenantsPage />
          ) : currentPage === 'Expenses' ? (
            <ExpensesPage />
          ) : currentPage === 'DatabaseTest' ? (
            <DatabaseTestPage />
          ) : (
            <div style={{
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b', marginBottom: '12px', margin: 0 }}>
                Welcome to JumbaJot
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
                Select a section from the sidebar to get started.
              </p>
            </div>
          )}
          </div>
        </section>
      </main>
      </div>
    </>
  );
}
