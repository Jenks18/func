import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import LeasesPage from './pages/LeasesFilesPageNew';
import DashboardPageWithDB from './pages/DashboardPageWithDB_Fixed';
import SettingsPage from './pages/SettingsPage';
import IncomePageNew from './pages/IncomePageNew';
import PropertiesPage from './pages/PropertiesPageRedesigned';
import TenantsPage from './pages/TenantsPage';
import UsersPage from './pages/UsersPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import MaintenancePage from './pages/MaintenancePageUpdated';
import MessagingPage from './pages/MessagingPageNew';
import DatabaseTestPage from './pages/DatabaseTestPage';
import AppMobile from './AppMobile';
import dataService from './services/dataService';
import { GRADIENT_BACKGROUND, GRADIENT_CARD, GRADIENT_BUTTON, GRADIENT_BUTTON_DARK, GRADIENT_NAVBAR, TEXT_PRIMARY, BORDER_LIGHT, PRIMARY_COLOR } from './config/theme';
import { NavIcons, UIIcons, ICON_SIZES } from './config/icons';
import { LogoSidebarExpanded, LogoSidebarCollapsed } from './components/Logo';

// Auth Pages
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import CreateOrganizationPage from './pages/auth/CreateOrganizationPage';
import OrganizationProfilePage from './pages/auth/OrganizationProfilePage';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import OrganizationSwitcher from './components/auth/OrganizationSwitcherCustom';
import UserButton from './components/auth/UserButtonCustom';

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
        {/* Public Routes - no SignedIn/SignedOut wrapper needed */}
        <Route 
          path="/sign-in/*" 
          element={
            <>
              <SignedOut>
                <SignInPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
            </>
          } 
        />
        <Route 
          path="/sign-up/*" 
          element={
            <>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/onboarding" replace />
              </SignedIn>
            </>
          } 
        />
        
        {/* Protected Routes */}
        <Route
          path="/onboarding"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <OnboardingPage />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/create-organization"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <CreateOrganizationPage />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/organization"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <OrganizationProfilePage />
              </SignedIn>
            </>
          }
        />
        
        {/* Main App Routes */}
        <Route
          path="/dashboard"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/properties"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/tenants"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/leases"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/income"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/expenses"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/maintenance"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/messaging"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/reports"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <MainApp />
              </SignedIn>
            </>
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
    if (path === 'users') return 'Users';
    if (path === 'leases') return 'LeasesFiles';
    if (path === 'income') return 'Income';
    if (path === 'expenses') return 'Expenses';
    if (path === 'maintenance') return 'Maintenance';
    if (path === 'messaging') return 'Messaging';
    if (path === 'reports') return 'Reports';
    if (path === 'settings') return 'Settings';
    return 'Dashboard';
  };

  const currentPage = getCurrentPage();

  const menuItems = [
    { name: 'Dashboard', component: 'Dashboard', Icon: NavIcons.Dashboard },
    { name: 'Properties', component: 'Properties', Icon: NavIcons.Properties },
    { name: 'Tenants', component: 'Tenants', Icon: NavIcons.Tenants },
    { name: 'Users', component: 'Users', Icon: NavIcons.Users },
    { name: 'Leases & Files', component: 'LeasesFiles', Icon: NavIcons.Leases },
    { name: 'Income', component: 'Income', Icon: NavIcons.Income },
    { name: 'Expenses', component: 'Expenses', Icon: NavIcons.Expenses },
    { name: 'Maintenance', component: 'Maintenance', Icon: NavIcons.Wrench },
    { name: 'Messaging', component: 'Messaging', Icon: NavIcons.Mail },
    { name: 'Reports', component: 'Reports', Icon: NavIcons.BarChart },
  ];

  // Initialize database
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await dataService.initialize();
        setIsDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDbError(error.message);
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
        background: GRADIENT_BACKGROUND,
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
      'Users': '/users',
      'LeasesFiles': '/leases',
      'Income': '/income',
      'Expenses': '/expenses',
      'Maintenance': '/maintenance',
      'Messaging': '/messaging',
      'Reports': '/reports',
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
        background: GRADIENT_BACKGROUND,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 20s ease infinite'
      }}>
      {/* Sidebar */}
        <div 
          style={{
            width: sidebarExpanded || sidebarHovered ? '280px' : '72px',
            background: GRADIENT_BUTTON,
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${BORDER_LIGHT}`,
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
            borderBottom: '1px solid rgba(20, 184, 166, 0.2)',
            overflow: 'hidden',
            transition: 'padding 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '72px',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%)'
          }}>
            {(sidebarExpanded || sidebarHovered) ? (
              <LogoSidebarExpanded />
            ) : (
              <LogoSidebarCollapsed />
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
                    ? GRADIENT_CARD
                    : (hoveredItem === index ? 'rgba(255, 255, 255, 0.3)' : 'transparent'),
                  color: currentPage === item.component ? TEXT_PRIMARY : TEXT_PRIMARY,
                  border: 'none',
                  borderLeft: currentPage === item.component ? `4px solid ${PRIMARY_COLOR}` : '4px solid transparent',
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
                <item.Icon 
                  size={ICON_SIZES.md}
                  strokeWidth={currentPage === item.component ? 2.5 : 2}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                />
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
                    ? GRADIENT_CARD
                    : 'transparent',
                  color: currentPage === 'Settings' ? TEXT_PRIMARY : TEXT_PRIMARY,
                  border: 'none',
                  borderLeft: currentPage === 'Settings' ? `4px solid ${PRIMARY_COLOR}` : '4px solid transparent',
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
                <NavIcons.Settings 
                  size={ICON_SIZES.md}
                  strokeWidth={currentPage === 'Settings' ? 2.5 : 2}
                  style={{ flexShrink: 0 }}
                />
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Settings</span>}
              </button>
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  color: TEXT_PRIMARY,
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
                <UIIcons.HelpCircle 
                  size={ICON_SIZES.md}
                  style={{ flexShrink: 0 }}
                />
                {(sidebarExpanded || sidebarHovered) && <span style={{ whiteSpace: 'nowrap' }}>Help</span>}
              </button>
              <button
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'transparent',
                  color: TEXT_PRIMARY,
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
                <NavIcons.Logout 
                  size={ICON_SIZES.md}
                  style={{ flexShrink: 0 }}
                />
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
          height: '56px',
          background: 'white',
          backdropFilter: 'blur(20px)',
          border: 'none',
          borderBottom: `1px solid ${BORDER_LIGHT}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          zIndex: 10,
          position: 'fixed',
          top: 0,
          left: (sidebarExpanded || sidebarHovered) ? '280px' : '72px',
          right: 0,
          transition: 'left 0.3s ease'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              style={{
                background: 'none',
                border: `1px solid ${BORDER_LIGHT}`,
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                color: TEXT_PRIMARY,
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.05)';
                e.currentTarget.style.borderColor = BORDER_MEDIUM;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.borderColor = BORDER_LIGHT;
              }}
            >
              <UIIcons.Menu size={18} />
            </button>
            <span style={{ fontSize: '15px', fontWeight: '600', color: TEXT_PRIMARY }}>
              {menuItems.find(item => item.component === currentPage)?.name || 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <OrganizationSwitcher />
            <UserButton />
          </div>
        </header>

        {/* Dashboard Content */}
        <section style={{
          flex: 1,
          padding: '24px',
          marginTop: '56px',
          minHeight: 'calc(100vh - 56px)',
          overflowX: 'hidden',
          overflowY: 'auto',
          background: '#f9fafb'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: `1px solid ${BORDER_LIGHT}`,
            minHeight: 'calc(100vh - 104px)',
            overflow: 'hidden'
          }}>
          {currentPage === 'LeasesFiles' ? (
            <LeasesPage />
          ) : currentPage === 'Dashboard' ? (
            <DashboardPageWithDB onNavigate={handleNavigation} />
          ) : currentPage === 'Settings' ? (
            <SettingsPage />
          ) : currentPage === 'Income' ? (
            <IncomePageNew />
          ) : currentPage === 'Properties' ? (
            <PropertiesPage />
          ) : currentPage === 'Tenants' ? (
            <TenantsPage />
          ) : currentPage === 'Users' ? (
            <UsersPage />
          ) : currentPage === 'Expenses' ? (
            <ExpensesPage />
          ) : currentPage === 'Maintenance' ? (
            <MaintenancePage />
          ) : currentPage === 'Messaging' ? (
            <MessagingPage />
          ) : currentPage === 'Reports' ? (
            <ReportsPage />
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
