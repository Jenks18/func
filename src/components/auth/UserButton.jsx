/**
 * User Button Component
 * Shows user avatar and dropdown menu
 */

import { UserButton as ClerkUserButton } from '@clerk/clerk-react';

export default function UserButton({ isMobile = false }) {
  return (
    <ClerkUserButton
      appearance={{
        elements: {
          userButtonAvatarBox: isMobile 
            ? 'w-12 h-12 border-2 border-white shadow-md'
            : 'w-10 h-10 border-2 border-white shadow-sm',
          userButtonPopoverCard: 'border border-[#bfdbfe] shadow-lg',
          userButtonPopoverActionButton: 'text-[#3b82f6] hover:bg-[#f0f9ff]',
          userButtonPopoverActionButtonText: 'text-[#1e40af]',
          userButtonPopoverFooter: 'hidden'
        }
      }}
      showName={!isMobile}
      afterSignOutUrl="/sign-in"
    />
  );
}
