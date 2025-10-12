/**
 * Sign Up Page
 * Supports email, phone, username, and Google OAuth
 */

import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
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
            background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '3px solid white',
            boxShadow: '0 8px 16px rgba(59,130,246,0.2)'
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
            color: '#1e40af',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            JumbaJot
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#60a5fa',
            margin: 0
          }}>
            Start managing your properties today
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
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
          afterSignUpUrl="/onboarding"
          redirectUrl="/onboarding"
          unsafeMetadata={{
            phoneOptional: true
          }}
          appearance={{
            elements: {
              card: 'shadow-lg border border-[#bfdbfe]',
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
