/**
 * Sign Up Page
 * Supports email, phone, username, and Google OAuth
 */

import { SignUp } from '@clerk/clerk-react';
import { GRADIENT_BACKGROUND, GRADIENT_BUTTON, GRADIENT_CARD_LIGHT, TEXT_PRIMARY, BORDER_LIGHT } from '../../config/theme';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: GRADIENT_BACKGROUND,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: GRADIENT_BUTTON,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '3px solid white',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}>
            <span style={{
              fontSize: '36px',
              color: 'white',
              fontWeight: '700'
            }}>J</span>
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: TEXT_PRIMARY,
            margin: '0 0 8px 0',
            background: GRADIENT_BUTTON,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            JumbaJot
          </h1>
          <p style={{
            fontSize: '16px',
            color: TEXT_PRIMARY,
            margin: 0,
            opacity: 0.7
          }}>
            Start managing your properties today
          </p>
        </div>

        <div style={{
          background: GRADIENT_CARD_LIGHT,
          border: `1px solid ${BORDER_LIGHT}`,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'start',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '20px',
              marginTop: '2px'
            }}>ℹ️</div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '6px'
              }}>
                Phone Number Optional
              </div>
              <div style={{
                fontSize: '13px',
                color: '#60a5fa',
                lineHeight: '1.5'
              }}>
                Adding a phone number is optional but <strong>highly recommended</strong> for account recovery, two-factor authentication, and important notifications.
              </div>
            </div>
          </div>
        </div>
        
        <SignUp 
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
          unsafeMetadata={{
            phoneOptional: true
          }}
          appearance={{
            elements: {
              card: `shadow-lg border border-[${BORDER_LIGHT}]`,
              headerTitle: 'text-[#1e40af]',
              headerSubtitle: 'text-[#60a5fa]',
              socialButtonsBlockButton: 'border-[#bfdbfe] hover:bg-[#f0f9ff]',
              socialButtonsBlockButtonText: 'text-[#1e40af]',
              formButtonPrimary: 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-[#2563eb] hover:to-[#3b82f6]',
              footerActionLink: 'text-[#3b82f6] hover:text-[#2563eb]',
              formFieldLabel: 'text-[#1e40af] font-medium',
              formFieldInput: 'bg-[#f0f9ff] border-[#bfdbfe] text-[#1e40af] focus:border-[#3b82f6]',
              identityPreviewEditButton: 'text-[#3b82f6]',
              formFieldInputShowPasswordButton: 'text-[#3b82f6]',
              otpCodeFieldInput: 'border-[#bfdbfe] focus:border-[#3b82f6]',
              formFieldSuccessText: 'text-[#0284c7]',
              dividerLine: 'bg-[#bfdbfe]',
              dividerText: 'text-[#60a5fa]',
              formFieldHintText: 'text-[#60a5fa] text-sm',
              formFieldInfoText: 'text-[#60a5fa] text-sm',
              formFieldWarningText: 'text-[#f59e0b]',
              phoneInputBox: 'bg-[#f0f9ff] border-[#bfdbfe]',
              formResendCodeLink: 'text-[#3b82f6] hover:text-[#2563eb]'
            },
            layout: {
              socialButtonsPlacement: 'top',
              socialButtonsVariant: 'blockButton',
              termsPageUrl: 'https://jumbajot.com/terms',
              privacyPageUrl: 'https://jumbajot.com/privacy'
            }
          }}
        />
      </div>
    </div>
  );
}
