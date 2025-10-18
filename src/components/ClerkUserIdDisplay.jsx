import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';

/**
 * TEMPORARY COMPONENT - Shows your Clerk User ID
 * 
 * HOW TO USE:
 * 1. Import this component in your App.jsx or any page
 * 2. Add <ClerkUserIdDisplay /> somewhere in your app
 * 3. Sign in to your app
 * 4. Your Clerk User ID will appear on screen AND in the console
 * 5. Copy the ID and update 004_sample_data.sql
 * 6. Delete this component when done
 */
export default function ClerkUserIdDisplay() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      console.log('='.repeat(60));
      console.log('YOUR CLERK USER ID:');
      console.log(user.id);
      console.log('='.repeat(60));
      console.log('COPY THIS ID AND REPLACE "YOUR_ACTUAL_CLERK_USER_ID" in 004_sample_data.sql');
      console.log('='.repeat(60));
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div style={{ padding: '20px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', margin: '20px' }}>
      Loading Clerk user info...
    </div>;
  }

  if (!user) {
    return <div style={{ padding: '20px', background: '#f8d7da', border: '1px solid #dc3545', borderRadius: '8px', margin: '20px' }}>
      Please sign in to see your Clerk User ID
    </div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      background: '#d1ecf1', 
      border: '2px solid #0c5460', 
      borderRadius: '8px', 
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>🔑 Your Clerk User ID</h3>
      <div style={{ 
        background: '#fff', 
        padding: '15px', 
        borderRadius: '4px', 
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#0c5460',
        marginBottom: '10px'
      }}>
        {user.id}
      </div>
      <div style={{ fontSize: '14px', color: '#0c5460' }}>
        <strong>Instructions:</strong>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
          <li>Copy the ID above</li>
          <li>Open: <code>supabase/migrations/004_sample_data.sql</code></li>
          <li>Find: <code>YOUR_ACTUAL_CLERK_USER_ID</code></li>
          <li>Replace with: <code>{user.id}</code></li>
          <li>Save and run the SQL in Supabase</li>
          <li>Delete this component from your app</li>
        </ol>
      </div>
      <button 
        onClick={() => {
          navigator.clipboard.writeText(user.id);
          alert('Clerk User ID copied to clipboard!');
        }}
        style={{
          padding: '10px 20px',
          background: '#0c5460',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        📋 Copy to Clipboard
      </button>
    </div>
  );
}
