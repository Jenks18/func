// Role-Based Access Control Utilities for JumbaJot

/**
 * Filter data based on user's tenant
 * @param {Array} data - Array of objects with tenantId property
 * @param {Object} user - Current user object
 * @returns {Array} Filtered data for user's tenant
 */
export const filterByTenant = (data, user) => {
  if (!user) return [];
  
  // Super admin sees all data
  if (user.role === 'super_admin') {
    return data;
  }
  
  // Filter by user's tenant
  return data.filter(item => item.tenantId === user.tenantId);
};

/**
 * Filter data based on user's role and permissions
 * @param {Array} data - Array of data items
 * @param {Object} user - Current user object
 * @param {String} scope - Data scope (e.g., 'property', 'tenant', 'unit')
 * @returns {Array} Filtered data based on user's access level
 */
export const filterByRole = (data, user, scope = 'all') => {
  if (!user) return [];
  
  // Super admin and property manager see everything in their tenant
  if (user.role === 'super_admin' || user.role === 'property_manager') {
    return filterByTenant(data, user);
  }
  
  // Accountant sees all financial data in their tenant
  if (user.role === 'accountant') {
    return filterByTenant(data, user);
  }
  
  // Maintenance staff sees only properties with active maintenance
  if (user.role === 'maintenance') {
    const tenantData = filterByTenant(data, user);
    if (scope === 'property') {
      return tenantData.filter(item => item.hasMaintenanceRequests);
    }
    return tenantData;
  }
  
  // Tenants see only their own data
  if (user.role === 'tenant') {
    return data.filter(item => {
      if (scope === 'property') return item.id === user.propertyId;
      if (scope === 'unit') return item.id === user.unitId;
      if (scope === 'lease') return item.tenantId === user.id;
      if (scope === 'maintenance') return item.tenantId === user.id;
      return item.tenantId === user.id;
    });
  }
  
  // Viewers see all data in their tenant (read-only)
  if (user.role === 'viewer') {
    return filterByTenant(data, user);
  }
  
  return [];
};

/**
 * Get menu items based on user's role and permissions
 * @param {Object} user - Current user object
 * @returns {Array} Filtered menu items
 */
export const getMenuItemsForUser = (user) => {
  if (!user) return [];
  
  const allMenuItems = [
    { name: 'Dashboard', component: 'Dashboard', icon: '▢', roles: ['super_admin', 'property_manager', 'accountant', 'maintenance', 'tenant', 'viewer'] },
    { name: 'Properties', component: 'Properties', icon: '⌂', roles: ['super_admin', 'property_manager', 'accountant', 'maintenance', 'viewer'] },
    { name: 'Tenants', component: 'Tenants', icon: '◯', roles: ['super_admin', 'property_manager', 'accountant', 'viewer'] },
    { name: 'Applications', component: 'Applications', icon: '☰', roles: ['super_admin', 'property_manager'] },
    { name: 'Leases & Files', component: 'LeasesFiles', icon: '⎘', roles: ['super_admin', 'property_manager', 'accountant', 'tenant', 'viewer'] },
    { name: 'Income', component: 'Income', icon: '↑', roles: ['super_admin', 'property_manager', 'accountant', 'viewer'] },
    { name: 'Expenses', component: 'Expenses', icon: '↓', roles: ['super_admin', 'property_manager', 'accountant', 'viewer'] },
    { name: 'Maintenance', component: 'Maintenance', icon: '⚒', roles: ['super_admin', 'property_manager', 'maintenance', 'tenant'] },
    { name: 'Messaging', component: 'Messaging', icon: '✉', roles: ['super_admin', 'property_manager', 'tenant'] },
    { name: 'Listings', component: 'Listings', icon: '⊞', roles: ['super_admin', 'property_manager'] }
  ];
  
  return allMenuItems.filter(item => item.roles.includes(user.role));
};

/**
 * Get dashboard widgets based on user's role
 * @param {Object} user - Current user object
 * @returns {Array} Dashboard widgets configuration
 */
export const getDashboardWidgets = (user) => {
  if (!user) return [];
  
  const roleWidgets = {
    super_admin: [
      { id: 'total_tenants', title: 'Total Organizations', type: 'stat' },
      { id: 'total_properties', title: 'All Properties', type: 'stat' },
      { id: 'total_revenue', title: 'Total Revenue', type: 'stat' },
      { id: 'system_health', title: 'System Health', type: 'chart' }
    ],
    property_manager: [
      { id: 'total_properties', title: 'Total Properties', type: 'stat' },
      { id: 'vacant_units', title: 'Vacant Units', type: 'stat' },
      { id: 'overdue_rent', title: 'Overdue Rent', type: 'stat' },
      { id: 'maintenance_requests', title: 'Pending Maintenance', type: 'stat' },
      { id: 'revenue_chart', title: 'Revenue Overview', type: 'chart' },
      { id: 'occupancy_rate', title: 'Occupancy Rate', type: 'chart' }
    ],
    accountant: [
      { id: 'total_income', title: 'Total Income', type: 'stat' },
      { id: 'total_expenses', title: 'Total Expenses', type: 'stat' },
      { id: 'net_profit', title: 'Net Profit', type: 'stat' },
      { id: 'revenue_chart', title: 'Revenue Overview', type: 'chart' },
      { id: 'expense_breakdown', title: 'Expense Breakdown', type: 'chart' }
    ],
    maintenance: [
      { id: 'pending_requests', title: 'Pending Requests', type: 'stat' },
      { id: 'in_progress', title: 'In Progress', type: 'stat' },
      { id: 'completed_today', title: 'Completed Today', type: 'stat' },
      { id: 'recent_requests', title: 'Recent Requests', type: 'list' }
    ],
    tenant: [
      { id: 'rent_due', title: 'Rent Due', type: 'stat' },
      { id: 'lease_expiry', title: 'Lease Expiry', type: 'stat' },
      { id: 'maintenance_status', title: 'My Maintenance Requests', type: 'list' },
      { id: 'payment_history', title: 'Payment History', type: 'list' }
    ],
    viewer: [
      { id: 'total_properties', title: 'Total Properties', type: 'stat' },
      { id: 'total_tenants', title: 'Total Tenants', type: 'stat' },
      { id: 'occupancy_rate', title: 'Occupancy Rate', type: 'chart' }
    ]
  };
  
  return roleWidgets[user.role] || [];
};

/**
 * Check if user can perform action on resource
 * @param {Object} user - Current user object
 * @param {String} action - Action to perform (create, read, update, delete)
 * @param {String} resource - Resource type (property, tenant, lease, etc.)
 * @param {Object} resourceData - The actual resource data (optional)
 * @returns {Boolean} Whether user can perform action
 */
export const canPerformAction = (user, action, resource, resourceData = null) => {
  if (!user) return false;
  
  // Super admin can do everything
  if (user.role === 'super_admin') return true;
  
  // Check tenant isolation
  if (resourceData && resourceData.tenantId && resourceData.tenantId !== user.tenantId) {
    return false;
  }
  
  const actionMap = {
    property_manager: {
      property: ['create', 'read', 'update', 'delete'],
      tenant: ['create', 'read', 'update'],
      lease: ['create', 'read', 'update'],
      maintenance: ['create', 'read', 'update'],
      income: ['read', 'update'],
      expense: ['read', 'update']
    },
    accountant: {
      property: ['read'],
      tenant: ['read'],
      lease: ['read'],
      income: ['create', 'read', 'update', 'delete'],
      expense: ['create', 'read', 'update', 'delete']
    },
    maintenance: {
      property: ['read'],
      maintenance: ['create', 'read', 'update']
    },
    tenant: {
      lease: ['read'],
      maintenance: ['create', 'read']
    },
    viewer: {
      property: ['read'],
      tenant: ['read'],
      lease: ['read'],
      maintenance: ['read'],
      income: ['read'],
      expense: ['read']
    }
  };
  
  const userActions = actionMap[user.role];
  if (!userActions || !userActions[resource]) return false;
  
  return userActions[resource].includes(action);
};

/**
 * Get tenant configuration
 * @param {String} tenantId - Tenant ID
 * @returns {Object} Tenant configuration
 */
export const getTenantConfig = (tenantId) => {
  // This would typically come from a database
  // Mock data for demonstration
  const tenantConfigs = {
    tenant_1: {
      id: 'tenant_1',
      name: 'Acme Properties',
      logo: null,
      theme: {
        primaryColor: '#3b82f6',
        accentColor: '#60a5fa'
      },
      features: {
        messaging: true,
        listings: true,
        advancedReports: true,
        multiCurrency: false
      },
      settings: {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timezone: 'America/New_York'
      }
    }
  };
  
  return tenantConfigs[tenantId] || null;
};

/**
 * Apply row-level security based on user
 * @param {String} query - Database query
 * @param {Object} user - Current user object
 * @returns {String} Modified query with tenant filter
 */
export const applyRowLevelSecurity = (query, user) => {
  if (!user) return null;
  
  // Super admin sees everything
  if (user.role === 'super_admin') {
    return query;
  }
  
  // Add tenant filter for all other users
  return {
    ...query,
    tenantId: user.tenantId
  };
};

export default {
  filterByTenant,
  filterByRole,
  getMenuItemsForUser,
  getDashboardWidgets,
  canPerformAction,
  getTenantConfig,
  applyRowLevelSecurity
};
