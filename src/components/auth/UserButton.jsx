/**
 * User Button Component
 * Shows user avatar and dropdown menu
 * Minimalistic teal theme with refined styling
 */

import { UserButton as ClerkUserButton } from '@clerk/clerk-react';

export default function UserButton({ isMobile = false }) {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          // Avatar styling
          userButtonAvatarBox: isMobile 
            ? 'w-9 h-9 rounded-full border-2 border-[#99f6e4] shadow-sm ring-2 ring-[#f0fdfa] ring-offset-1'
            : 'w-8 h-8 rounded-full border-2 border-[#ccfbf1] hover:border-[#99f6e4] transition-all duration-150 shadow-sm',
          avatarBox: 'rounded-full',
          avatarImage: 'rounded-full',
          
          // Trigger button
          userButtonTrigger: 'focus:shadow-none',
          userButtonBox: 'rounded-full',
          
          // Dropdown/Popover card
          userButtonPopoverCard: 'border border-[#ccfbf1] shadow-lg rounded-lg bg-white min-w-[240px]',
          userButtonPopoverActions: 'border-t border-[#f0fdfa] pt-2',
          
          // User info in dropdown
          userPreview: 'px-3 py-2',
          userPreviewMainIdentifier: 'text-[#134e4a] font-semibold text-[14px]',
          userPreviewSecondaryIdentifier: 'text-[#14b8a6] text-[12px] font-normal',
          userButtonPopoverActionButton__manageAccount: 'text-[#14b8a6] hover:bg-[#f0fdfa] rounded-md transition-all duration-150 text-[13px] font-medium px-3 py-2',
          userButtonPopoverActionButton__signOut: 'text-[#ef4444] hover:bg-[#fef2f2] rounded-md transition-all duration-150 text-[13px] font-medium px-3 py-2',
          
          // Action buttons
          userButtonPopoverActionButton: 'text-[#14b8a6] hover:bg-[#f0fdfa] rounded-md transition-all duration-150 text-[13px] font-medium px-3 py-2',
          userButtonPopoverActionButtonText: 'text-[#0f766e] text-[13px] font-medium',
          userButtonPopoverActionButtonIcon: 'text-[#14b8a6] w-4 h-4',
          
          // Footer
          userButtonPopoverFooter: 'hidden',
          
          // Form elements
          formButtonPrimary: 'bg-[#14b8a6] text-white hover:bg-[#0d9488] rounded-md text-[13px] font-medium transition-all duration-150',
          
          // Card
          card: 'border-[#ccfbf1] rounded-lg',
          
          // Profile section
          profileSection: 'border-b border-[#f0fdfa] pb-3',
          profileSectionPrimaryButton: 'text-[#14b8a6] hover:bg-[#f0fdfa] rounded-md transition-all duration-150',
        },
        variables: {
          colorPrimary: '#14b8a6',
          colorDanger: '#ef4444',
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
      showName={!isMobile}
      afterSignOutUrl="/sign-in"
    />
  );
}
