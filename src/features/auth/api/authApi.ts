/**
 * Authentication API service
 */
// Try using absolute imports instead of relative paths
import { ApiResponse } from '@/core/api/apiClient';
import { User, LoginCredentials, SignupData, AuthResponse } from '@/features/auth/types';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/core/config/env';

// Create a local instance of the Supabase client
const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);

// Rest of your authentication functions...
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    // Transform the response to match our expected AuthResponse type
    return {
      data: data.user ? {
        user: {
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.displayName || '',
          role: data.user.user_metadata?.role || 'pet_owner',
        } as User,
        token: data.session?.access_token || ''
      } : null,
      error: error ? new Error(error.message) : null
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error during login')
    };
  }
};

// ... rest of the functions remain the same