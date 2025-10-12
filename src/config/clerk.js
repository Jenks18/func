/**
 * Clerk Configuration
 * Handles authentication and organization management
 */

export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  
  // Appearance customization to match JumbaJot blue theme
  appearance: {
    baseTheme: undefined,
    variables: {
      colorPrimary: '#3b82f6',
      colorText: '#1e40af',
      colorTextSecondary: '#60a5fa',
      colorBackground: '#ffffff',
      colorInputBackground: '#f0f9ff',
      colorInputText: '#1e40af',
      borderRadius: '0.75rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    elements: {
      card: 'shadow-lg border border-[#bfdbfe]',
      headerTitle: 'text-[#1e40af]',
      headerSubtitle: 'text-[#60a5fa]',
      socialButtonsBlockButton: 'border-[#bfdbfe] hover:bg-[#f0f9ff]',
      formButtonPrimary: 'bg-[#3b82f6] hover:bg-[#2563eb]',
      footerActionLink: 'text-[#3b82f6] hover:text-[#2563eb]',
      formFieldLabel: 'text-[#1e40af]',
      formFieldInput: 'bg-[#f0f9ff] border-[#bfdbfe] text-[#1e40af]',
      identityPreviewEditButton: 'text-[#3b82f6]',
      otpCodeFieldInput: 'border-[#bfdbfe]',
      organizationSwitcherTrigger: 'bg-gradient-to-r from-white to-[#f0f9ff] border-[#bfdbfe]',
      organizationPreviewMainIdentifier: 'text-[#1e40af]',
      organizationPreviewSecondaryIdentifier: 'text-[#60a5fa]'
    }
  },
  
  // Sign in/up configuration
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboard',
  afterSignUpUrl: '/onboarding',
  
  // Organization configuration
  organizationProfileMode: 'navigation',
  organizationProfileUrl: '/organization',
  createOrganizationUrl: '/create-organization',
  afterCreateOrganizationUrl: '/onboarding',
};

// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',      // Platform admin
  ORG_ADMIN: 'org_admin',          // Organization admin
  PROPERTY_OWNER: 'property_owner', // Property owner
  PROPERTY_MANAGER: 'manager',      // Property manager
  MAINTENANCE: 'maintenance',       // Maintenance staff
  TENANT: 'tenant'                  // Tenant/Renter
};

// Permission helpers
export const PERMISSIONS = {
  // Property permissions
  canCreateProperty: ['super_admin', 'org_admin', 'property_owner'],
  canEditProperty: ['super_admin', 'org_admin', 'property_owner', 'manager'],
  canDeleteProperty: ['super_admin', 'org_admin', 'property_owner'],
  canViewProperty: ['super_admin', 'org_admin', 'property_owner', 'manager', 'maintenance', 'tenant'],
  
  // Tenant permissions
  canCreateTenant: ['super_admin', 'org_admin', 'manager'],
  canEditTenant: ['super_admin', 'org_admin', 'manager'],
  canDeleteTenant: ['super_admin', 'org_admin'],
  canViewTenants: ['super_admin', 'org_admin', 'property_owner', 'manager'],
  
  // Financial permissions
  canViewFinancials: ['super_admin', 'org_admin', 'property_owner', 'manager'],
  canEditFinancials: ['super_admin', 'org_admin', 'manager'],
  
  // Maintenance permissions
  canCreateMaintenance: ['super_admin', 'org_admin', 'manager', 'maintenance', 'tenant'],
  canAssignMaintenance: ['super_admin', 'org_admin', 'manager'],
  canViewMaintenance: ['super_admin', 'org_admin', 'property_owner', 'manager', 'maintenance'],
  
  // Settings permissions
  canManageOrganization: ['super_admin', 'org_admin'],
  canInviteUsers: ['super_admin', 'org_admin', 'manager'],
  canManageUsers: ['super_admin', 'org_admin', 'property_owner', 'manager'],
};

export function hasPermission(userRole, permission) {
  return PERMISSIONS[permission]?.includes(userRole) || false;
}
