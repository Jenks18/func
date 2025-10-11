import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Usage: <ProtectedRoute><YourComponent /></ProtectedRoute>
 */
export const ProtectedRoute = ({ children, fallback = null }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return fallback || (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 4px 6px rgba(59,130,246,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#1e40af', marginBottom: '12px' }}>Authentication Required</h2>
          <p style={{ color: '#60a5fa', margin: 0 }}>Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * PermissionGuard - Shows content only if user has required permission(s)
 * Usage: <PermissionGuard permission="view_properties">...</PermissionGuard>
 * Usage: <PermissionGuard permissions={['view_properties', 'edit_property']} requireAll>...</PermissionGuard>
 */
export const PermissionGuard = ({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null,
  showMessage = false
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useAuth();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    if (showMessage) {
      return (
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#60a5fa'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
          <p style={{ margin: 0 }}>You don't have permission to view this content.</p>
        </div>
      );
    }
    return fallback;
  }

  return children;
};

/**
 * RoleGuard - Shows content only if user has required role(s)
 * Usage: <RoleGuard role="property_manager">...</RoleGuard>
 * Usage: <RoleGuard roles={['property_manager', 'super_admin']}>...</RoleGuard>
 */
export const RoleGuard = ({ 
  children, 
  role, 
  roles = [], 
  fallback = null,
  showMessage = false
}) => {
  const { hasRole, currentUser } = useAuth();

  let hasAccess = false;

  if (role) {
    hasAccess = hasRole(role);
  } else if (roles.length > 0) {
    hasAccess = roles.includes(currentUser?.role);
  }

  if (!hasAccess) {
    if (showMessage) {
      return (
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          textAlign: 'center',
          color: '#60a5fa'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔒</div>
          <p style={{ margin: 0 }}>This feature is only available for certain roles.</p>
        </div>
      );
    }
    return fallback;
  }

  return children;
};

/**
 * ConditionalButton - Shows/hides or disables button based on permissions
 * Usage: <ConditionalButton permission="create_property" onClick={...}>Add Property</ConditionalButton>
 */
export const ConditionalButton = ({ 
  children, 
  permission,
  permissions = [],
  requireAll = false,
  onClick,
  hideIfNoAccess = false,
  style = {},
  disabledStyle = {},
  ...props 
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = useAuth();

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true; // No permissions specified, allow access
  }

  if (!hasAccess && hideIfNoAccess) {
    return null;
  }

  const buttonStyle = {
    cursor: hasAccess ? 'pointer' : 'not-allowed',
    opacity: hasAccess ? 1 : 0.5,
    ...(hasAccess ? style : { ...style, ...disabledStyle })
  };

  return (
    <button
      {...props}
      style={buttonStyle}
      onClick={hasAccess ? onClick : undefined}
      disabled={!hasAccess}
    >
      {children}
    </button>
  );
};

/**
 * TenantGuard - Shows content only for specific tenant(s)
 * Useful for multi-tenant scenarios
 * Usage: <TenantGuard tenantId="tenant_1">...</TenantGuard>
 */
export const TenantGuard = ({ 
  children, 
  tenantId, 
  tenantIds = [],
  fallback = null
}) => {
  const { currentUser, ROLES } = useAuth();

  // Super admin can see everything
  if (currentUser?.role === ROLES.SUPER_ADMIN) {
    return children;
  }

  let hasAccess = false;

  if (tenantId) {
    hasAccess = currentUser?.tenantId === tenantId;
  } else if (tenantIds.length > 0) {
    hasAccess = tenantIds.includes(currentUser?.tenantId);
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

/**
 * FeatureFlag - Toggle features based on user role or tenant
 * Usage: <FeatureFlag feature="advanced_reports" enabledFor={['super_admin', 'property_manager']}>...</FeatureFlag>
 */
export const FeatureFlag = ({ 
  children, 
  feature,
  enabledFor = [], // Array of roles
  enabledTenants = [], // Array of tenant IDs
  fallback = null
}) => {
  const { currentUser } = useAuth();

  let isEnabled = false;

  // Check role-based access
  if (enabledFor.length > 0) {
    isEnabled = enabledFor.includes(currentUser?.role);
  }

  // Check tenant-based access
  if (!isEnabled && enabledTenants.length > 0) {
    isEnabled = enabledTenants.includes(currentUser?.tenantId);
  }

  // If no restrictions specified, enable for everyone
  if (enabledFor.length === 0 && enabledTenants.length === 0) {
    isEnabled = true;
  }

  if (!isEnabled) {
    return fallback;
  }

  return children;
};

/**
 * UserInfo - Display current user information
 * Usage: <UserInfo />
 */
export const UserInfo = ({ style = {} }) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div style={{
      padding: '12px',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
      border: '1px solid #bfdbfe',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#1e40af',
      ...style
    }}>
      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{currentUser.name}</div>
      <div style={{ fontSize: '12px', color: '#60a5fa' }}>{currentUser.email}</div>
      <div style={{ fontSize: '12px', color: '#60a5fa', marginTop: '4px' }}>
        Role: <span style={{ fontWeight: '500' }}>{currentUser.role}</span>
      </div>
      {currentUser.tenantName && (
        <div style={{ fontSize: '12px', color: '#60a5fa' }}>
          Org: <span style={{ fontWeight: '500' }}>{currentUser.tenantName}</span>
        </div>
      )}
    </div>
  );
};

export default {
  ProtectedRoute,
  PermissionGuard,
  RoleGuard,
  ConditionalButton,
  TenantGuard,
  FeatureFlag,
  UserInfo
};
