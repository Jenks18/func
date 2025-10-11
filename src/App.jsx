import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
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

// Auth Pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import CreateOrganizationPage from './pages/auth/CreateOrganizationPage';
import OrganizationProfilePage from './pages/auth/OrganizationProfilePage';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import OrganizationSwitcher from './components/auth/OrganizationSwitcher';
import UserButton from './components/auth/UserButton';

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Check screen size - now includes tablets
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If mobile/tablet, use mobile app (with its own routing)
  if (isMobile) {
    return <AppMobile />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <SignedIn>
              <OnboardingPage />
            </SignedIn>
          }
        />
        <Route
          path="/create-organization"
          element={
            <SignedIn>
              <CreateOrganizationPage />
            </SignedIn>
          }
        />
        <Route
          path="/organization"
          element={
            <SignedIn>
              <OrganizationProfilePage />
            </SignedIn>
          }
        />
        
        {/* Main App Routes */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        <Route
          path="/properties"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        <Route
          path="/tenants"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        <Route
          path="/leases"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        <Route
          path="/income"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        <Route
          path="/expenses"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        <Route
          path="/settings"
          element={
            <SignedIn>
              <MainApp />
            </SignedIn>
          }
        />
        
        {/* Default route */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
        
        {/* Catch all */}
        <Route
          path="*"
          element={
            <>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Main authenticated app component
function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname.replace('/', '');
    if (path === '' || path === 'dashboard') return 'Dashboard';
    if (path === 'properties') return 'Properties';
    if (path === 'tenants') return 'Tenants';
    if (path === 'leases') return 'LeasesFiles';
    if (path === 'income') return 'Income';
    if (path === 'expenses') return 'Expenses';
    if (path === 'settings') return 'Settings';
    return 'Dashboard';
  };

  const currentPage = getCurrentPage();

  const menuItems = [
    { name: 'Dashboard', component: 'Dashboard', icon: '▢' },
    { name: 'Properties', component: 'Properties', icon: '⌂' },
    { name: 'Tenants', component: 'Tenants', icon: '◯' },
    { name: 'Applications', component: 'Applications', icon: '☰' },
    { name: 'Leases & Files', component: 'LeasesFiles', icon: '⎘' },
    { name: 'Income', component: 'Income', icon: '↑' },
    { name: 'Expenses', component: 'Expenses', icon: '↓' },
    { name: 'Maintenance', component: 'Maintenance', icon: '⚒' },
    { name: 'Messaging', component: 'Messaging', icon: '✉' },
    { name: 'Listings', component: 'Listings', icon: '⊞' }
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
        // Don't block UI - just log the error
        setIsDbInitialized(true); // Set to true anyway so UI loads
      }
    };

    initializeDatabase();
  }, []);

  // Show loading screen while database initializes
  if (!isDbInitialized && !dbError) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e40af'
        }}>
          JumbaJot
        </div>
        <div style={{
          fontSize: '16px',
          color: '#60a5fa'
        }}>
          Loading your dashboard...
        </div>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #bfdbfe',
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

  // Don't show error screen - just log it and continue
  // This allows the app to work even without Supabase

  const handleNavigation = (component, params = {}) => {
    // Map component names to routes
    const routeMap = {
      'Dashboard': '/dashboard',
      'Properties': '/properties',
      'Tenants': '/tenants',
      'LeasesFiles': '/leases',
      'Income': '/income',
      'Expenses': '/expenses',
      'Settings': '/settings'
    };
    
    const route = routeMap[component] || '/dashboard';
    navigate(route);
    
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
        <div 
          style={{
            width: sidebarExpanded || sidebarHovered ? '280px' : '72px',
            background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 25%, #bfdbfe 50%, #93c5fd 75%, #60a5fa 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(59, 130, 246, 0.1)',
            minHeight: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            boxShadow: '0 8px 32px 0 rgba(59, 130, 246, 0.15)'
          }}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => setSidebarHovered(false)}
        >
          {/* Logo */}
          <div style={{
            padding: (sidebarExpanded || sidebarHovered) ? '24px' : '20px 0',
            borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
            overflow: 'hidden',
            transition: 'padding 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '72px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              margin: 0,
              whiteSpace: 'nowrap',
              opacity: (sidebarExpanded || sidebarHovered) ? 1 : 0,
              transition: 'opacity 0.3s ease',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {(sidebarExpanded || sidebarHovered) ? 'JumbaJot' : ''}
            </h1>
            {!(sidebarExpanded || sidebarHovered) && (
              <div style={{
                color: '#1e40af',
                fontSize: '22px',
                fontWeight: 'bold',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #3b82f6',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)'
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
                onClick={() => handleNavigation(item.component)}
                style={{
                  width: '100%',
                  height: '48px',
                  padding: (sidebarExpanded || sidebarHovered) ? '0 16px' : '0',
                  background: currentPage === item.component 
                    ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)' 
                    : (hoveredItem === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent'),
                  color: currentPage === item.component ? '#1e40af' : '#1e3a8a',
                  border: 'none',
                  borderLeft: currentPage === item.component ? '4px solid #3b82f6' : '4px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: currentPage === item.component ? '600' : '500',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  borderRadius: currentPage === item.component ? '0 8px 8px 0' : '0'
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
                onClick={() => handleNavigation('Settings')}
                style={{
                  width: '100%',
                  height: '48px',
                  background: currentPage === 'Settings' 
                    ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)' 
                    : 'transparent',
                  color: currentPage === 'Settings' ? '#1e40af' : '#1e3a8a',
                  border: 'none',
                  borderLeft: currentPage === 'Settings' ? '4px solid #3b82f6' : '4px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: currentPage === 'Settings' ? '600' : '500',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  borderRadius: currentPage === 'Settings' ? '0 8px 8px 0' : '0'
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚙</span>
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
              </button>
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  color: '#1e3a8a',
                  border: 'none',
                  borderLeft: '4px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  borderRadius: '0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.borderRadius = '0 8px 8px 0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderRadius = '0';
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</span>
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Help</span>}
              </button>
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  color: '#1e3a8a',
                  border: 'none',
                  borderLeft: '4px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (sidebarExpanded || sidebarHovered) ? 'flex-start' : 'center',
                  gap: (sidebarExpanded || sidebarHovered) ? '16px' : '0',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  borderRadius: '0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
                  e.currentTarget.style.borderRadius = '0 8px 8px 0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderRadius = '0';
                }}
                onClick={() => window.location.href = '/sign-in'}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↲</span>
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
          background: 'linear-gradient(90deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
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
                color: '#1e40af',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
            >
              <span style={{ fontSize: '18px' }}>☰</span>
            </button>
            <span style={{ fontSize: '20px', fontWeight: '600', color: '#1e40af' }}>
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
              color: '#3b82f6'
            }}>
              🔔
            </button>
            <OrganizationSwitcher />
            <UserButton />
          </div>
        </header>

        {/* Dashboard Content */}
        <section style={{
          flex: 1,
          padding: '24px',
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #e0f2fe 75%, #f0f9ff 100%)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            minHeight: 'calc(100vh - 112px)',
            boxShadow: '0 8px 32px 0 rgba(59, 130, 246, 0.15)',
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
