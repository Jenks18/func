/**
 * Organization Switcher Component
 * Allows users to switch between organizations and manage them
 * Minimalistic teal theme with refined styling
 */

import { OrganizationSwitcher as ClerkOrgSwitcher } from '@clerk/clerk-react';

export default function OrganizationSwitcher({ isMobile = false }) {
  return (
    <ClerkOrgSwitcher
      appearance={{
        elements: {
          rootBox: isMobile ? 'w-full' : '',
          // Main trigger button
          organizationSwitcherTrigger: isMobile 
            ? 'w-full bg-white border border-[#ccfbf1] rounded-md px-3 py-2.5 text-[#134e4a] text-[13px] font-medium hover:bg-[#f0fdfa] hover:border-[#99f6e4] transition-all duration-150 shadow-sm'
            : 'bg-white border border-[#ccfbf1] rounded-md px-3 py-2 text-[#134e4a] text-[13px] font-medium hover:bg-[#f0fdfa] hover:border-[#99f6e4] transition-all duration-150 shadow-sm',
          
          // Organization icon/avatar
          organizationSwitcherTriggerIcon: 'text-[#14b8a6] w-4 h-4',
          avatarBox: 'w-6 h-6 rounded-md border border-[#99f6e4] bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1]',
          avatarImage: 'rounded-md',
          
          // Dropdown/Popover
          organizationSwitcherPopoverCard: 'border border-[#ccfbf1] shadow-lg rounded-lg bg-white min-w-[280px]',
          organizationSwitcherPopoverActions: 'border-t border-[#f0fdfa] pt-2',
          
          // Action buttons in dropdown
          organizationSwitcherPopoverActionButton: 'text-[#14b8a6] hover:bg-[#f0fdfa] rounded-md transition-all duration-150 px-3 py-2',
          organizationSwitcherPopoverActionButtonText: 'text-[#0f766e] text-[13px] font-medium',
          organizationSwitcherPopoverActionButtonIcon: 'text-[#14b8a6] w-4 h-4',
          
          // Organization preview in dropdown
          organizationPreview: 'hover:bg-[#f0fdfa] rounded-md transition-all duration-150',
          organizationPreviewAvatarBox: 'w-10 h-10 rounded-md border border-[#99f6e4] bg-gradient-to-br from-[#f0fdfa] to-[#ccfbf1]',
          organizationPreviewAvatarImage: 'rounded-md',
          organizationPreviewMainIdentifier: 'text-[#134e4a] font-semibold text-[14px]',
          organizationPreviewSecondaryIdentifier: 'text-[#14b8a6] text-[12px] font-normal',
          
          // Preview button
          organizationSwitcherPreviewButton: 'hover:bg-[#f0fdfa] rounded-md transition-all duration-150 px-3 py-2',
          
          // Badges
          badge: 'bg-[#14b8a6] text-white text-[11px] font-medium rounded-md px-2 py-0.5',
          
          // Invite members section
          inviteMembersPageInviteButton: 'bg-[#14b8a6] text-white hover:bg-[#0d9488] rounded-md text-[13px] font-medium transition-all duration-150',
          
          // Form elements
          formButtonPrimary: 'bg-[#14b8a6] text-white hover:bg-[#0d9488] rounded-md text-[13px] font-medium transition-all duration-150',
          formFieldInput: 'border-[#ccfbf1] focus:border-[#14b8a6] rounded-md text-[13px]',
          
          // Footer
          organizationSwitcherPopoverFooter: 'border-t border-[#f0fdfa] pt-2',
        },
        variables: {
          colorPrimary: '#14b8a6',
          colorTextOnPrimaryBackground: 'white',
          colorTextSecondary: '#0f766e',
          colorBackground: 'white',
          colorInputBackground: 'white',
          colorInputText: '#134e4a',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: {
            normal: 500,
            medium: 600,
            bold: 600
          }
        }
      }}
      hidePersonal={false}
      organizationProfileMode="navigation"
      organizationProfileUrl="/organization"
      createOrganizationMode="navigation"
      createOrganizationUrl="/create-organization"
      afterSelectOrganizationUrl="/dashboard"
      afterCreateOrganizationUrl="/onboarding"
      afterLeaveOrganizationUrl="/dashboard"
    />
  );
}
