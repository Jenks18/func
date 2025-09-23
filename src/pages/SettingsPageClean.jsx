import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const settingsCategories = [
    { id: 'general', name: 'GENERAL', icon: '⚙️' },
    { id: 'bank', name: 'BANK', icon: '🏦' },
    { id: 'notifications', name: 'NOTIFICATIONS', icon: '🔔' },
    { id: 'security', name: 'SECURITY', icon: '🔒' }
  ];

  return (
    <div style={{
      width: '100%',
      padding: '24px',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Left Sidebar */}
        <div style={{
          width: '280px',
          background: 'white',
          borderRight: '1px solid #e5e7eb',
          padding: '24px 0',
          borderRadius: '8px',
          height: 'fit-content'
        }}>
          {settingsCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              style={{
                width: '100%',
                padding: '12px 24px',
                border: 'none',
                background: activeTab === category.id ? '#3b82f6' : 'transparent',
                color: activeTab === category.id ? 'white' : '#6b7280',
                fontSize: '12px',
                fontWeight: '600',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div style={{
          flex: 1,
          padding: '0'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '24px',
              margin: 0
            }}>
              {activeTab === 'general' && 'General Settings'}
              {activeTab === 'bank' && 'Bank Settings'}
              {activeTab === 'notifications' && 'Notification Settings'}
              {activeTab === 'security' && 'Security Settings'}
            </h2>
            
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              padding: '40px'
            }}>
              {activeTab === 'general' && 'General configuration options would be displayed here'}
              {activeTab === 'bank' && 'Bank integration settings would be displayed here'}
              {activeTab === 'notifications' && 'Email and SMS notification preferences would be displayed here'}
              {activeTab === 'security' && 'Password and security configuration would be displayed here'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
