/**
 * Organization Switcher Component
 * Allows users to switch between organizations and manage them
 */

import { OrganizationSwitcher as ClerkOrgSwitcher } from '@clerk/clerk-react';

export default function OrganizationSwitcher({ isMobile = false }) {
  return (
    <ClerkOrgSwitcher
      appearance={{
        elements: {
          rootBox: 'w-full',
          organizationSwitcherTrigger: isMobile 
            ? 'w-full bg-gradient-to-r from-white to-[#f0f9ff] border border-[#bfdbfe] rounded-lg px-4 py-3 text-[#1e40af] font-medium hover:bg-[#e0f2fe]'
            : 'bg-gradient-to-r from-white to-[#f0f9ff] border border-[#bfdbfe] rounded-lg px-3 py-2 text-[#1e40af] hover:bg-[#e0f2fe]',
          organizationSwitcherPopoverCard: 'border border-[#bfdbfe] shadow-lg',
          organizationSwitcherPopoverActionButton: 'text-[#3b82f6] hover:bg-[#f0f9ff]',
          organizationSwitcherPopoverActionButtonText: 'text-[#1e40af]',
          organizationPreviewMainIdentifier: 'text-[#1e40af] font-semibold',
          organizationPreviewSecondaryIdentifier: 'text-[#60a5fa]',
          organizationSwitcherPreviewButton: 'hover:bg-[#f0f9ff]',
          organizationSwitcherTriggerIcon: 'text-[#3b82f6]',
          badge: 'bg-[#3b82f6] text-white'
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
