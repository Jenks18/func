/**
 * Custom hook for authenticated Supabase client
 * Automatically includes Clerk JWT token in all requests
 */

import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createAuthenticatedSupabaseClient } from '../config/supabase';

export function useAuthenticatedSupabase() {
  const { getToken, isLoaded, userId } = useAuth();

  const supabase = useMemo(() => {
    if (!isLoaded || !userId) {
      return null;
    }
    return createAuthenticatedSupabaseClient(getToken);
  }, [getToken, isLoaded, userId]);

  return { supabase, isReady: !!supabase };
}
