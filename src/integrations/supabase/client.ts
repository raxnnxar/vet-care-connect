import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { env } from '../../core/config/env';

// Use environment variables from env.ts
const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

// Log whether we're using environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anon key not found in environment variables');
} else {
  console.log('Using Supabase credentials from environment variables');
}

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export specific services for better type safety
export const authService = supabase.auth;
export const storageService = supabase.storage;
export const dbService = supabase;