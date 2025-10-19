/**
 * Custom Organization Switcher Component
 * Fully custom UI with teal theme
 * Supports custom organization logos/images
 */

import { useOrganization, useOrganizationList, useUser } from '@clerk/clerk-react';
import { useState, useRef, useEffect } from 'react';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogoOrgSwitcher } from '../Logo';

// You can set a custom default logo here
const DEFAULT_ORG_LOGO = null; // Set to '/path/to/your/logo.png' or import an image
const USE_CUSTOM_LOGO_COMPONENT = true; // Set to true to use the custom LogoIcon component

export default function OrganizationSwitcher({ isMobile = false, customLogo = null }) {
  const { organization } = useOrganization();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const { user } = useUser();
  const navigate = useNavigate();
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

  const currentOrg = organization;
  const orgs = userMemberships?.data || [];
  
  // Get the logo to display - priority: customLogo > org.imageUrl > DEFAULT_ORG_LOGO
  const getOrgLogo = (org) => {
    if (customLogo) return customLogo;
    if (org?.imageUrl) return org.imageUrl;
    return DEFAULT_ORG_LOGO;
  };

  const currentLogo = getOrgLogo(currentOrg);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'white',
          border: '1px solid #ccfbf1',
          borderRadius: '6px',
          padding: isMobile ? '10px 12px' : '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          color: '#134e4a',
          transition: 'all 0.15s ease',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          minWidth: isMobile ? '100%' : '200px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f0fdfa';
          e.currentTarget.style.borderColor = '#99f6e4';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#ccfbf1';
        }}
      >
        {/* Organization Icon */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          border: '1px solid #99f6e4',
          background: currentLogo ? 'white' : (USE_CUSTOM_LOGO_COMPONENT ? 'transparent' : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          {currentLogo ? (
            <img 
              src={currentLogo} 
              alt={currentOrg?.name || 'Organization'} 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                padding: '2px'
              }}
            />
          ) : USE_CUSTOM_LOGO_COMPONENT ? (
            <LogoOrgSwitcher size={28} color="#14b8a6" />
          ) : (
            <Building2 size={16} color="#14b8a6" strokeWidth={2} />
          )}
        </div>

        {/* Organization Name */}
        <span style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textAlign: 'left'
        }}>
          {currentOrg?.name || 'Personal Account'}
        </span>

        {/* Dropdown Icon */}
        <ChevronDown 
          size={14} 
          color="#14b8a6" 
          style={{ 
            flexShrink: 0,
            transition: 'transform 0.15s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: isMobile ? 0 : 'auto',
          background: 'white',
          border: '1px solid #ccfbf1',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          minWidth: isMobile ? '100%' : '280px',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0fdfa',
            fontSize: '11px',
            fontWeight: 600,
            color: '#14b8a6',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Select Account
          </div>

          {/* Personal Account */}
          <div style={{ padding: '8px 0' }}>
            <button
              onClick={async () => {
                await setActive({ organization: null });
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                background: !currentOrg ? '#f0fdfa' : 'none',
                border: 'none',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => !currentOrg && (e.currentTarget.style.background = '#f0fdfa')}
              onMouseLeave={(e) => !currentOrg && (e.currentTarget.style.background = '#f0fdfa')}
            >
              {/* Avatar */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #99f6e4',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Personal" 
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
                    {(user?.fullName || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#134e4a',
                  marginBottom: '2px'
                }}>
                  Personal Account
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#14b8a6',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {user?.primaryEmailAddress?.emailAddress}
                </div>
              </div>

              {/* Check Icon */}
              {!currentOrg && (
                <Check size={16} color="#14b8a6" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Organizations */}
          {orgs.length > 0 && (
            <>
              <div style={{
                padding: '8px 16px 4px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#14b8a6',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderTop: '1px solid #f0fdfa'
              }}>
                Organizations
              </div>
              <div style={{ padding: '4px 0 8px' }}>
                {orgs.map(({ organization: org }) => (
                  <button
                    key={org.id}
                    onClick={async () => {
                      await setActive({ organization: org.id });
                      setIsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      background: currentOrg?.id === org.id ? '#f0fdfa' : 'none',
                      border: 'none',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
                    onMouseLeave={(e) => e.currentTarget.style.background = currentOrg?.id === org.id ? '#f0fdfa' : 'none'}
                  >
                    {/* Logo */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '6px',
                      border: '1px solid #99f6e4',
                      background: getOrgLogo(org) ? 'white' : (USE_CUSTOM_LOGO_COMPONENT ? 'transparent' : 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden'
                    }}>
                      {getOrgLogo(org) ? (
                        <img 
                          src={getOrgLogo(org)} 
                          alt={org.name} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'contain',
                            padding: '2px'
                          }}
                        />
                      ) : USE_CUSTOM_LOGO_COMPONENT ? (
                        <LogoOrgSwitcher size={28} color="#14b8a6" />
                      ) : (
                        <Building2 size={18} color="#14b8a6" strokeWidth={2.5} />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#134e4a',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {org.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#14b8a6'
                      }}>
                        {org.membersCount || 0} {org.membersCount === 1 ? 'member' : 'members'}
                      </div>
                    </div>

                    {/* Check Icon */}
                    {currentOrg?.id === org.id && (
                      <Check size={16} color="#14b8a6" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Create Organization */}
          <div style={{ borderTop: '1px solid #f0fdfa', padding: '8px' }}>
            <button
              onClick={() => {
                navigate('/create-organization');
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: '#14b8a6',
                transition: 'background 0.15s ease',
                borderRadius: '6px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdfa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                border: '1px dashed #14b8a6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={12} color="#14b8a6" strokeWidth={2.5} />
              </div>
              <span>Create Organization</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
