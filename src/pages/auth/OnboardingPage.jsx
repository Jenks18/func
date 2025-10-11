/**
 * Onboarding Page
 * Collects user role and organization information
 */

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedSupabase } from '../../hooks/useAuthenticatedSupabase';
import { ROLES } from '../../config/clerk';

export default function OnboardingPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { supabase } = useAuthenticatedSupabase();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already onboarded
  useEffect(() => {
    if (user?.publicMetadata?.onboarded) {
      console.log('User already onboarded, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting onboarding...', { role, organizationName });

      // Update user metadata in Clerk
      await user.update({
        publicMetadata: {
          role: role,
          onboarded: true
        }
      });

      console.log('Updated Clerk metadata');

      // Check if we're in demo mode (Supabase not set up)
      const isDemoMode = import.meta.env.VITE_SUPABASE_URL?.includes('demo');
      
      if (!isDemoMode && supabase) {
        // Real mode: Create organization and user in Supabase
        let orgId;
        
        if (role === ROLES.TENANT) {
          // Tenants don't create organizations
          orgId = null;
        } else {
          // Create organization
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: organizationName,
              created_by: user.id
            })
            .select()
            .single();

          if (orgError) {
            console.error('Organization creation error:', orgError);
            throw new Error('Failed to create organization: ' + orgError.message);
          }
          orgId = orgData.id;
          console.log('Created organization:', orgId);
        }

        // Create user record in Supabase
        const { error: userError } = await supabase
          .from('users')
          .insert({
            clerk_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            role: role,
            organization_id: orgId,
            first_name: user.firstName || '',
            last_name: user.lastName || ''
          });

        if (userError) {
          console.error('User creation error:', userError);
          throw new Error('Failed to create user profile: ' + userError.message);
        }

        console.log('Created user profile');
      } else {
        // Demo mode: Skip database, just use Clerk metadata
        console.log('🎨 DEMO MODE: Skipping database creation');
        console.log('User role stored in Clerk metadata');
      }

      // Force a small delay to ensure metadata is updated
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to dashboard
      console.log('Navigating to dashboard...');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Onboarding error:', error);
      setError(error.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        borderRadius: '16px',
        border: '1px solid #bfdbfe',
        boxShadow: '0 4px 16px rgba(59,130,246,0.1)',
        padding: '40px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1e40af',
            marginBottom: '8px'
          }}>
            Welcome to JumbaJot!
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#60a5fa',
            margin: 0
          }}>
            Let's set up your account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '8px'
              }}>
                What's your role?
              </label>
              
              <div style={{
                display: 'grid',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {[
                  { value: ROLES.PROPERTY_OWNER, label: 'Property Owner', icon: '⌂', desc: 'I own rental properties' },
                  { value: ROLES.PROPERTY_MANAGER, label: 'Property Manager', icon: '☰', desc: 'I manage properties for others' },
                  { value: ROLES.MAINTENANCE, label: 'Maintenance', icon: '⚒', desc: 'I handle property maintenance' },
                  { value: ROLES.TENANT, label: 'Tenant', icon: '◯', desc: 'I rent a property' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setRole(option.value);
                      if (option.value !== ROLES.TENANT) {
                        setStep(2);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      border: role === option.value ? '2px solid #3b82f6' : '1px solid #bfdbfe',
                      borderRadius: '12px',
                      background: role === option.value ? '#f0f9ff' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#1e40af',
                      flexShrink: 0
                    }}>
                      {option.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1e40af',
                        marginBottom: '4px'
                      }}>
                        {option.label}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#60a5fa'
                      }}>
                        {option.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ← Back
              </button>

              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e40af',
                marginBottom: '8px'
              }}>
                Organization Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g., Smith Property Management"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#1e40af',
                  background: '#f0f9ff',
                  marginBottom: '24px',
                  boxSizing: 'border-box'
                }}
              />

              <button
                type="submit"
                disabled={!organizationName || loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
              </button>
            </div>
          )}

          {step === 1 && role === ROLES.TENANT && (
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
