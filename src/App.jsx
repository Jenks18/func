import React, { useState } from 'react';
import LeasesFilesPage from './pages/LeasesFilesPageNew';
import DashboardPage from './pages/DashboardPage';

const sidebarNav = [
  { key: 'dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2V7a2 2 0 00-2-2h-3.5" /></svg>
  ) },
  { key: 'properties', label: 'Properties', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0h4" /></svg>
  ) },
  { key: 'tenants', label: 'Tenants', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
  ) },
  { key: 'leases', label: 'Leases & Files', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z" /></svg>
  ) },
  { key: 'income', label: 'Income', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2a2 2 0 004 0h2c0 2.21-1.79 4-4 4z" /></svg>
  ) },
  { key: 'expenses', label: 'Expenses', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  ) },
  { key: 'maintenance', label: 'Maintenance', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 21l3-1 3 1-.75-4M9 13h6" /></svg>
  ) },
  { key: 'messaging', label: 'Messaging', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
  ) },
  { key: 'listings', label: 'Listings', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10-5v4a1 1 0 01-1 1h-3m-4 0h4" /></svg>
  ) },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNavigation = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #ffffff 100%)'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: 'linear-gradient(180deg, #ea580c 0%, #c2410c 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 12px',
        boxShadow: '0 25px 50px -12px rgba(234, 88, 12, 0.25)',
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        minHeight: '100vh',
        borderRight: '1px solid #fb923c'
      }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.025em' }}>Keja</span>
        </div>
        <nav style={{ flex: 1 }}>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sidebarNav.map(item => (
              <li key={item.key}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '16px',
                    backgroundColor: activeTab === item.key ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '600',
                    letterSpacing: '0.025em'
                  }}
                  onClick={() => setActiveTab(item.key)}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.key) {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.key) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginTop: '40px', fontSize: '12px', color: '#fed7aa', paddingLeft: '8px' }}>
          &copy; {new Date().getFullYear()} Keja Property Management
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top Navbar */}
        <header style={{
          height: '64px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid #fed7aa',
          display: 'flex',
          alignItems: 'center',
          padding: '0 40px',
          boxShadow: '0 1px 3px 0 rgba(234, 88, 12, 0.1)',
          zIndex: 10,
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#c2410c', letterSpacing: '0.025em' }}>
              {sidebarNav.find(i => i.key === activeTab)?.label}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#9a3412', fontWeight: '500' }}>Welcome, LandlordKJ</span>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fb923c 0%, #ea580c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              color: '#ffffff',
              border: '2px solid #fed7aa'
            }}>
              KJ
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <section style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: activeTab === 'leases' || activeTab === 'dashboard' ? '0' : '48px 32px',
          background: 'transparent'
        }}>
          {activeTab === 'leases' ? (
            <LeasesFilesPage />
          ) : activeTab === 'dashboard' ? (
            <DashboardPage onNavigate={handleNavigation} />
          ) : (
            <div style={{
              borderRadius: '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 20px 25px -5px rgba(234, 88, 12, 0.1)',
              padding: '48px',
              minHeight: '350px',
              minWidth: '700px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fed7aa'
            }}>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#c2410c', marginBottom: '12px', margin: 0 }}>
                Welcome to Keja Property Management
              </h2>
              <p style={{ color: '#9a3412', fontSize: '18px', margin: 0 }}>
                Select a section from the sidebar to get started.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
