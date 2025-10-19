/**
 * Clerk Provider Wrapper
 * Wraps the entire app with Clerk authentication
 */

import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';
import { clerkConfig } from '../../config/clerk';

export function ClerkProvider({ children }) {
  if (!clerkConfig.publishableKey) {
    console.error('Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file');
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#1e40af', marginBottom: '16px' }}>Configuration Required</h2>
          <p style={{ color: '#60a5fa', marginBottom: '16px' }}>
            Missing Clerk Publishable Key. Please add <code style={{ 
              background: '#f0f9ff', 
              padding: '4px 8px', 
              borderRadius: '4px',
              color: '#1e40af'
            }}>VITE_CLERK_PUBLISHABLE_KEY</code> to your .env file.
          </p>
          <a 
            href="https://clerk.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#3b82f6',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Get Clerk API Key
          </a>
        </div>
      </div>
    );
  }

  return (
    <BaseClerkProvider 
      publishableKey={clerkConfig.publishableKey}
      appearance={clerkConfig.appearance}
      routing="path"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      signInForceRedirectUrl="/dashboard"
      signUpForceRedirectUrl="/dashboard"
    >
      {children}
    </BaseClerkProvider>
  );
}
