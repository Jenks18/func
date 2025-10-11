// EXAMPLE: How to integrate RBAC into your existing App.jsx
// This is a reference file showing the changes needed

import React, { useState, useEffect } from 'react';
import './App.css';

// Import RBAC components and hooks
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute, PermissionGuard, UserInfo } from './components/auth/RBAC';
import { getMenuItemsForUser } from './utils/rbac';
import RoleSwitcher from './components/RoleSwitcher';

// Your existing page imports
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import TenantsPage from './pages/TenantsPage';
// ... other imports

export default function App() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  
  // Get current user and permissions
  const { currentUser, PERMISSIONS } = useAuth();
  
  // Filter menu items based on user role
  const menuItems = getMenuItemsForUser(currentUser);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile view detection
  if (isMobile) {
    return <AppMobile />;
  }

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: '260px',
          background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 25%, #bfdbfe 50%, #93c5fd 75%, #60a5fa 100%)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'white',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: '#3b82f6',
                border: '2px solid #3b82f6'
              }}>
                J
              </div>
              <span style={{
                fontSize: '22px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}>
                JumbaJot
              </span>
            </div>
            
            {/* User info in sidebar */}
            <div style={{ marginTop: '16px' }}>
              <UserInfo style={{
                background: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                padding: '10px'
              }} />
            </div>
          </div>

          {/* Navigation Menu - Filtered by Role */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 12px'
          }}>
            {menuItems.map((item) => (
              <button
                key={item.component}
                onClick={() => setActiveView(item.component)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  marginBottom: '4px',
                  border: 'none',
                  borderLeft: activeView === item.component ? '4px solid #3b82f6' : '4px solid transparent',
                  background: activeView === item.component
                    ? 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)'
                    : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '15px',
                  fontWeight: activeView === item.component ? '600' : '500',
                  color: activeView === item.component ? '#1e40af' : 'rgba(30, 64, 175, 0.7)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Bottom Menu */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <button
              onClick={() => setActiveView('Settings')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                fontWeight: '500',
                color: 'rgba(30, 64, 175, 0.7)',
                borderRadius: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>⚙</span>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top Navigation Bar */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.95) 100%)',
            padding: '16px 32px',
            borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 5
          }}>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1e40af'
            }}>
              {activeView}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              {/* Show tenant name for non-super admins */}
              {currentUser?.tenantName && (
                <div style={{
                  fontSize: '14px',
                  color: '#60a5fa',
                  padding: '6px 12px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe'
                }}>
                  {currentUser.tenantName}
                </div>
              )}

              {/* Conditional buttons based on permissions */}
              <PermissionGuard permission={PERMISSIONS.VIEW_SETTINGS}>
                <button style={{
                  padding: '8px 16px',
                  background: 'white',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  color: '#1e40af',
                  cursor: 'pointer'
                }}>
                  ⚙ Settings
                </button>
              </PermissionGuard>

              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '600',
                fontSize: '16px',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
              }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #e0f2fe 75%, #f0f9ff 100%)',
            padding: '24px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #bfdbfe',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.05)',
              minHeight: 'calc(100vh - 160px)',
              padding: '24px'
            }}>
              {/* Render pages with permission checks */}
              {activeView === 'Dashboard' && <DashboardPage />}
              
              <PermissionGuard permission={PERMISSIONS.VIEW_PROPERTIES} showMessage>
                {activeView === 'Properties' && <PropertiesPage />}
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.VIEW_TENANTS} showMessage>
                {activeView === 'Tenants' && <TenantsPage />}
              </PermissionGuard>
              
              {/* Add more views with permission guards */}
            </div>
          </div>
        </div>

        {/* Role Switcher - DEVELOPMENT ONLY */}
        <RoleSwitcher />
      </div>
    </ProtectedRoute>
  );
}

/* 
INTEGRATION STEPS:

1. Wrap your app in main.jsx:
   import { AuthProvider } from './contexts/AuthContext';
   <AuthProvider><App /></AuthProvider>

2. Import the hooks and components:
   import { useAuth } from './contexts/AuthContext';
   import { ProtectedRoute, PermissionGuard } from './components/auth/RBAC';

3. Get current user in your component:
   const { currentUser, PERMISSIONS } = useAuth();

4. Filter menu items:
   const menuItems = getMenuItemsForUser(currentUser);

5. Wrap your app in ProtectedRoute:
   <ProtectedRoute>...</ProtectedRoute>

6. Use PermissionGuard for conditional rendering:
   <PermissionGuard permission={PERMISSIONS.VIEW_PROPERTIES}>...</PermissionGuard>

7. Add RoleSwitcher for testing:
   <RoleSwitcher />

8. Test different roles using the switcher
*/
