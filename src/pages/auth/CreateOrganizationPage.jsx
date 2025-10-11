/**
 * Create Organization Page
 * Allows users to create a new organization
 */

import { CreateOrganization } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function CreateOrganizationPage() {
  const navigate = useNavigate();

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
            Create Organization
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#60a5fa',
            margin: 0
          }}>
            Set up your property management company
          </p>
        </div>
        
        <CreateOrganization 
          afterCreateOrganizationUrl="/onboarding"
          routing="path"
          path="/create-organization"
        />
        
        <div style={{
          textAlign: 'center',
          marginTop: '24px'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
