/**
 * Custom hook to get current user with role and organization
 */

import { useState, useEffect } from 'react';
import { useUser, useOrganization } from '@clerk/clerk-react';
import { useAuthenticatedSupabase } from './useAuthenticatedSupabase';

export function useCurrentUser() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { supabase, isReady } = useAuthenticatedSupabase();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!isUserLoaded || !isOrgLoaded || !isReady || !user) {
        setLoading(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          setDbUser(null);
        } else {
          setDbUser(data);
        }
      } catch (err) {
        console.error('Error in fetchUserData:', err);
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user, isUserLoaded, isOrgLoaded, isReady, supabase]);

  return {
    // Clerk user data
    clerkUser: user,
    organization,
    
    // Database user data (with role)
    user: dbUser,
    role: dbUser?.role || user?.publicMetadata?.role,
    organizationId: dbUser?.organization_id || organization?.id,
    
    // Loading states
    isLoaded: isUserLoaded && isOrgLoaded,
    loading,
    
    // Combined check
    isAuthenticated: !!user && !!dbUser
  };
}
