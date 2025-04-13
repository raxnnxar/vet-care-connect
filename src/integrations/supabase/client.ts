
/**
 * Supabase client configuration
 * 
 * This file creates and exports the Supabase client for use throughout the app.
 */

import { createClient } from '@supabase/supabase-js';
import { env } from '../../core/config/env';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = env.supabaseUrl || 'https://qfqnctbatpreuberetga.supabase.co';
const supabaseAnonKey = env.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmcW5jdGJhdHByZXViZXJldGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMjQ3NTksImV4cCI6MjA1OTgwMDc1OX0.GNQVoCSAIDfMdJ5GGkPx1pH08R8vJTQBVOUwBO4a-WA';

// Check if Supabase credentials are valid
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create and export the Supabase client with full configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Log initialization status
console.log('Supabase client initialized with URL:', supabaseUrl);
if (isSupabaseConfigured) {
  console.log('Supabase client is configured with proper credentials');
} else {
  console.warn('Supabase client may be using placeholder credentials - functionality may be limited');
}
