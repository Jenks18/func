/**
 * Sign In Page
 */

import { SignIn } from '@clerk/clerk-react';
import { GRADIENT_BACKGROUND, GRADIENT_BUTTON, TEXT_PRIMARY } from '../../config/theme';

export default function SignInPage() {
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
            Property Management Made Simple
          </p>
        </div>
        
        <SignIn 
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
