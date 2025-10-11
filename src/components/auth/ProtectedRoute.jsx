/**
 * Protected Route Component
 * Ensures user is authenticated and has required role
 */

import { useAuth } from '@clerk/clerk-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { hasPermission } from '../../config/clerk';

export default function ProtectedRoute({ children, requiredPermission, requiredRole }) {
  const { isLoaded, userId } = useAuth();
  const { user, role, loading } = useCurrentUser();

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          border: '1px solid #bfdbfe',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #bfdbfe',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#60a5fa', margin: 0 }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!userId) {
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
          <h2 style={{ color: '#1e40af', marginBottom: '16px' }}>Authentication Required</h2>
          <p style={{ color: '#60a5fa', marginBottom: '24px' }}>
            Please sign in to access JumbaJot
          </p>
          <a 
            href="/sign-in" 
            style={{
              display: 'inline-block',
              background: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && role !== requiredRole) {
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
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#1e40af', marginBottom: '16px' }}>Access Denied</h2>
          <p style={{ color: '#60a5fa' }}>
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(role, requiredPermission)) {
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
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#1e40af', marginBottom: '16px' }}>Permission Required</h2>
          <p style={{ color: '#60a5fa' }}>
            You don't have permission to perform this action.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
