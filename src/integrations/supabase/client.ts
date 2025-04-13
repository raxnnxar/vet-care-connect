/**
 * Supabase client configuration
 * 
 * This file initializes and exports the Supabase client for use throughout the application.
 */
import { createClient } from '@supabase/supabase-js';
import { env } from '../../core/config/env';

// Use environment variables
const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization status
console.log(`Supabase client initialized with URL: ${supabaseUrl.substring(0, 20)}...`);