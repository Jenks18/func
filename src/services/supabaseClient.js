import { createClient } from '@supabase/supabase-js';

// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found in environment variables');
  console.warn('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get current organization ID from Clerk user
 * @param {Object} user - Clerk user object
 * @returns {string} Organization ID
 */
export const getCurrentOrgId = (user) => {
  if (!user?.organizationMemberships?.[0]?.organization?.id) {
    console.warn('No organization found for user');
    return null;
  }
  return user.organizationMemberships[0].organization.id;
};

/**
 * Get current user ID from Supabase users table
 * @param {string} clerkId - Clerk user ID
 * @returns {Promise<string>} Supabase user ID
 */
export const getSupabaseUserId = async (clerkId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('clerk_id', clerkId)
    .single();
  
  if (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
  
  return data?.id;
};

/**
 * Upload file to Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path in bucket
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Upload result
 */
export const uploadFile = async (bucket, path, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return {
    path: data.path,
    url: publicUrl
  };
};

/**
 * Delete file from Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - File path in bucket
 * @returns {Promise<void>}
 */
export const deleteFile = async (bucket, path) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
};

export default supabase;
