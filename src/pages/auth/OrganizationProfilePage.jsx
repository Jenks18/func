/**
 * Organization Profile Page
 * Manage organization settings, members, and invitations
 */

import { OrganizationProfile } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function OrganizationProfilePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e40af',
              margin: '0 0 8px 0'
            }}>
              Organization Settings
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#60a5fa',
              margin: 0
            }}>
              Manage your organization, members, and settings
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
        
        <OrganizationProfile 
          routing="path"
          path="/organization"
        />
      </div>
    </div>
  );
}
