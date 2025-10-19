/**
 * Custom hook for authenticated Supabase client
 * Automatically includes Clerk JWT token in all requests
 * 
 * Returns a singleton Supabase client to prevent
 * "Multiple GoTrueClient instances" warnings
 */

import { useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { createAuthenticatedSupabaseClient } from '../config/supabase';

export function useAuthenticatedSupabase() {
  const { getToken, isLoaded, userId } = useAuth();

  // Create client only once when auth is ready
  // The createAuthenticatedSupabaseClient function handles caching
  const supabase = useMemo(() => {
    if (!isLoaded || !userId) {
      return null;
    }
    return createAuthenticatedSupabaseClient(getToken);
  }, [isLoaded, userId]); // Removed getToken from dependencies to maintain singleton

  return { supabase, isReady: !!supabase };
}
