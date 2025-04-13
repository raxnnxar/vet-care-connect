
/**
 * Supabase client configuration
 * 
 * This file creates and exports the Supabase client for use throughout the app.
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '../../core/config/env';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = env.supabaseUrl || '';
const supabaseAnonKey = env.supabaseAnonKey || '';

// Check if Supabase credentials are set
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl || 'https://placeholder-url.supabase.co', supabaseAnonKey);

// Log initialization status
if (isSupabaseConfigured) {
  console.log('Supabase client initialized with configuration');
} else {
  console.warn('Supabase client initialized with placeholder values - functionality will be limited');
}
