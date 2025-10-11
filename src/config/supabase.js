/**
 * Supabase Configuration
 * Handles database operations and real-time subscriptions
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create base Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Create Supabase client with Clerk JWT token
 * This ensures RLS policies work correctly with Clerk authentication
 */
export function createAuthenticatedSupabaseClient(getToken) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: async () => {
        const token = await getToken({ template: 'supabase' });
        return token ? { Authorization: `Bearer ${token}` } : {};
      }
    }
  });
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
