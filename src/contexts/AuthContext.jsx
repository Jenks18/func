import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Auth Context
const AuthContext = createContext(null);

// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',        // Full system access, manages all tenants
  PROPERTY_MANAGER: 'property_manager', // Manages properties, tenants, leases
  ACCOUNTANT: 'accountant',          // Views financials, manages income/expenses
  MAINTENANCE: 'maintenance',        // Views and manages maintenance requests
  TENANT: 'tenant',                  // Limited view of their own info
  VIEWER: 'viewer'                   // Read-only access
};

// Permission definitions
export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // Properties
  VIEW_PROPERTIES: 'view_properties',
  CREATE_PROPERTY: 'create_property',
  EDIT_PROPERTY: 'edit_property',
  DELETE_PROPERTY: 'delete_property',
  
  // Tenants
  VIEW_TENANTS: 'view_tenants',
  CREATE_TENANT: 'create_tenant',
  EDIT_TENANT: 'edit_tenant',
  DELETE_TENANT: 'delete_tenant',
  
  // Leases
  VIEW_LEASES: 'view_leases',
  CREATE_LEASE: 'create_lease',
  EDIT_LEASE: 'edit_lease',
  DELETE_LEASE: 'delete_lease',
  
  // Financials
  VIEW_INCOME: 'view_income',
  CREATE_INCOME: 'create_income',
  EDIT_INCOME: 'edit_income',
  DELETE_INCOME: 'delete_income',
  
  VIEW_EXPENSES: 'view_expenses',
  CREATE_EXPENSE: 'create_expense',
  EDIT_EXPENSE: 'edit_expense',
  DELETE_EXPENSE: 'delete_expense',
  
  // Maintenance
  VIEW_MAINTENANCE: 'view_maintenance',
  CREATE_MAINTENANCE: 'create_maintenance',
  EDIT_MAINTENANCE: 'edit_maintenance',
  DELETE_MAINTENANCE: 'delete_maintenance',
  
  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
  
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USER: 'create_user',
  EDIT_USER: 'edit_user',
  DELETE_USER: 'delete_user'
};

// Role to permissions mapping
const rolePermissions = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // All permissions
  
  [ROLES.PROPERTY_MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_TENANTS,
    PERMISSIONS.CREATE_TENANT,
    PERMISSIONS.EDIT_TENANT,
    PERMISSIONS.VIEW_LEASES,
    PERMISSIONS.CREATE_LEASE,
    PERMISSIONS.EDIT_LEASE,
    PERMISSIONS.VIEW_INCOME,
    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.CREATE_MAINTENANCE,
    PERMISSIONS.EDIT_MAINTENANCE,
    PERMISSIONS.VIEW_SETTINGS
  ],
  
  [ROLES.ACCOUNTANT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_TENANTS,
    PERMISSIONS.VIEW_LEASES,
    PERMISSIONS.VIEW_INCOME,
    PERMISSIONS.CREATE_INCOME,
    PERMISSIONS.EDIT_INCOME,
    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.CREATE_EXPENSE,
    PERMISSIONS.EDIT_EXPENSE
  ],
  
  [ROLES.MAINTENANCE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.CREATE_MAINTENANCE,
    PERMISSIONS.EDIT_MAINTENANCE
  ],
  
  [ROLES.TENANT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_LEASES,
    PERMISSIONS.VIEW_MAINTENANCE,
    PERMISSIONS.CREATE_MAINTENANCE
  ],
  
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_TENANTS,
    PERMISSIONS.VIEW_LEASES,
    PERMISSIONS.VIEW_INCOME,
    PERMISSIONS.VIEW_EXPENSES,
    PERMISSIONS.VIEW_MAINTENANCE
  ]
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Mock user - in production, this would come from your authentication service
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user from localStorage or API
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('jumbajot_user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        } else {
          // Default user for development (remove in production)
          const defaultUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: ROLES.PROPERTY_MANAGER,
            tenantId: 'tenant_1', // Organization/Company ID
            tenantName: 'Acme Properties',
            avatar: null,
            permissions: rolePermissions[ROLES.PROPERTY_MANAGER]
          };
          setCurrentUser(defaultUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions?.includes(permission) || false;
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!currentUser) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    if (!currentUser) return false;
    return permissions.every(permission => hasPermission(permission));
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  // Login function (mock - replace with real authentication)
  const login = async (email, password, tenantId) => {
    try {
      // In production, call your authentication API
      // const response = await authService.login(email, password, tenantId);
      
      // Mock user based on role
      const mockUsers = {
        'admin@example.com': {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: ROLES.SUPER_ADMIN,
          tenantId: null, // Super admin can access all tenants
          tenantName: 'System Administrator',
          avatar: null,
          permissions: rolePermissions[ROLES.SUPER_ADMIN]
        },
        'manager@example.com': {
          id: '2',
          name: 'Property Manager',
          email: 'manager@example.com',
          role: ROLES.PROPERTY_MANAGER,
          tenantId: tenantId || 'tenant_1',
          tenantName: 'Acme Properties',
          avatar: null,
          permissions: rolePermissions[ROLES.PROPERTY_MANAGER]
        },
        'accountant@example.com': {
          id: '3',
          name: 'Accountant User',
          email: 'accountant@example.com',
          role: ROLES.ACCOUNTANT,
          tenantId: tenantId || 'tenant_1',
          tenantName: 'Acme Properties',
          avatar: null,
          permissions: rolePermissions[ROLES.ACCOUNTANT]
        },
        'maintenance@example.com': {
          id: '4',
          name: 'Maintenance Staff',
          email: 'maintenance@example.com',
          role: ROLES.MAINTENANCE,
          tenantId: tenantId || 'tenant_1',
          tenantName: 'Acme Properties',
          avatar: null,
          permissions: rolePermissions[ROLES.MAINTENANCE]
        },
        'tenant@example.com': {
          id: '5',
          name: 'Tenant User',
          email: 'tenant@example.com',
          role: ROLES.TENANT,
          tenantId: tenantId || 'tenant_1',
          tenantName: 'Acme Properties',
          propertyId: 'property_1',
          unitId: 'unit_2a',
          avatar: null,
          permissions: rolePermissions[ROLES.TENANT]
        }
      };

      const user = mockUsers[email];
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('jumbajot_user', JSON.stringify(user));
        return { success: true, user };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jumbajot_user');
  };

  // Switch tenant (for super admin)
  const switchTenant = (tenantId, tenantName) => {
    if (currentUser && currentUser.role === ROLES.SUPER_ADMIN) {
      const updatedUser = {
        ...currentUser,
        tenantId,
        tenantName
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('jumbajot_user', JSON.stringify(updatedUser));
    }
  };

  // Update user role (for admin purposes)
  const updateUserRole = (newRole) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        role: newRole,
        permissions: rolePermissions[newRole]
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('jumbajot_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    switchTenant,
    updateUserRole,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
