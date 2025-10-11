import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Role Switcher Component - For Testing/Demo Purposes
 * This allows you to quickly switch between different roles to see how the UI changes
 * Remove this in production
 */
export default function RoleSwitcher() {
  const { currentUser, updateUserRole, ROLES } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const roleInfo = {
    [ROLES.SUPER_ADMIN]: {
      label: 'Super Admin',
      description: 'Full system access',
      color: '#8b5cf6',
      icon: '⚡'
    },
    [ROLES.PROPERTY_MANAGER]: {
      label: 'Property Manager',
      description: 'Manage properties & tenants',
      color: '#3b82f6',
      icon: '⌂'
    },
    [ROLES.ACCOUNTANT]: {
      label: 'Accountant',
      description: 'Financial management',
      color: '#10b981',
      icon: '↑'
    },
    [ROLES.MAINTENANCE]: {
      label: 'Maintenance Staff',
      description: 'Maintenance requests',
      color: '#f59e0b',
      icon: '⚒'
    },
    [ROLES.TENANT]: {
      label: 'Tenant',
      description: 'Limited access',
      color: '#6b7280',
      icon: '◯'
    },
    [ROLES.VIEWER]: {
      label: 'Viewer',
      description: 'Read-only access',
      color: '#06b6d4',
      icon: '👁'
    }
  };

  const currentRoleInfo = roleInfo[currentUser.role] || roleInfo[ROLES.VIEWER];

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999
    }}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 20px',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span>{currentRoleInfo.icon}</span>
        <span>{currentRoleInfo.label}</span>
        <span style={{ fontSize: '10px' }}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          right: '0',
          width: '300px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(59,130,246,0.2)',
          padding: '16px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid #bfdbfe'
          }}>
            Switch Role (Testing Mode)
          </div>

          {Object.entries(ROLES).map(([key, roleValue]) => {
            const info = roleInfo[roleValue];
            const isActive = currentUser.role === roleValue;

            return (
              <button
                key={roleValue}
                onClick={() => {
                  updateUserRole(roleValue);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  marginBottom: '8px',
                  background: isActive 
                    ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                    : 'transparent',
                  border: isActive ? '2px solid #3b82f6' : '1px solid #e0f2fe',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f0f9ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{
                  fontSize: '24px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive ? '#3b82f6' : '#e0f2fe',
                  color: isActive ? 'white' : '#1e40af',
                  borderRadius: '6px',
                  flexShrink: 0
                }}>
                  {info.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isActive ? '#1e40af' : '#3b82f6',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {info.label}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#60a5fa',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {info.description}
                  </div>
                </div>
                {isActive && (
                  <div style={{
                    fontSize: '16px',
                    color: '#3b82f6',
                    flexShrink: 0
                  }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}

          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #bfdbfe',
            fontSize: '11px',
            color: '#60a5fa',
            textAlign: 'center'
          }}>
            ⚠️ Development Mode Only
          </div>
        </div>
      )}
    </div>
  );
}
