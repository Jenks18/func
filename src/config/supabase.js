/**
 * Supabase Configuration
 * Handles database operations and real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton instance cache to prevent multiple GoTrueClient warnings
let authenticatedClientInstance = null;
let currentGetToken = null;

/**
 * Create or return cached Supabase client with Clerk JWT token
 * This ensures RLS policies work correctly with Clerk authentication
 * Uses singleton pattern to avoid "Multiple GoTrueClient instances" warning
 */
export function createAuthenticatedSupabaseClient(getToken) {
  // Return cached instance if getToken hasn't changed
  if (authenticatedClientInstance && currentGetToken === getToken) {
    return authenticatedClientInstance;
  }

  // Create new instance only when necessary
  currentGetToken = getToken;
  authenticatedClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: async () => {
        const token = await getToken({ template: 'supabase' });
        return token ? { Authorization: `Bearer ${token}` } : {};
      }
    }
  });

  return authenticatedClientInstance;
}

/**
 * Database table names
 */
export const TABLES = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  PROPERTIES: 'properties',
  UNITS: 'units',
  TENANTS: 'tenants',
  LEASES: 'leases',
  TRANSACTIONS: 'transactions',
  MAINTENANCE_REQUESTS: 'maintenance_requests',
  MESSAGES: 'messages',
  LISTINGS: 'listings',
  FILES: 'files'
};
