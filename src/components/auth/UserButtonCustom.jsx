/**
 * Custom User Button Component
 * Fully custom UI with teal theme
 */

import { useUser, useClerk } from '@clerk/clerk-react';
import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function UserButton({ isMobile = false }) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!user) return null;

  const avatarSize = isMobile ? 36 : 32;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          border: '2px solid #ccfbf1',
          overflow: 'hidden',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          ...(isOpen && { borderColor: '#99f6e4' })
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#99f6e4'}
        onMouseLeave={(e) => !isOpen && (e.currentTarget.style.borderColor = '#ccfbf1')}
        >
          {user.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt={user.fullName || user.username || 'User'} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#14b8a6',
              fontSize: '14px',
              fontWeight: 600
            }}>
              {(user.fullName || user.username || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        
        {!isMobile && (
          <>
            <span style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#134e4a',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.fullName || user.username || 'User'}
            </span>
            <ChevronDown 
              size={14} 
              color="#14b8a6" 
              style={{ 
                transition: 'transform 0.15s ease',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'white',
          border: '1px solid #ccfbf1',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          minWidth: '240px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* User Info */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0fdfa'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#134e4a',
              marginBottom: '2px'
            }}>
              {user.fullName || user.username}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#14b8a6',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.primaryEmailAddress?.emailAddress}
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: '8px 0' }}>
            {/* Manage Account */}
            <button
              onClick={() => {
                openUserProfile();
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#0f766e',
                transition: 'background 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <Settings size={16} color="#14b8a6" strokeWidth={2} />
              <span>Manage Account</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#dc2626',
                transition: 'background 0.15s ease',
                textAlign: 'left',
                borderTop: '1px solid #f0fdfa',
                marginTop: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={16} color="#ef4444" strokeWidth={2} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
