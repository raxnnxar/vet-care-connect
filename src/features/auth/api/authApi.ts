/**
 * Authentication API service
 * 
 * Provides methods for user authentication and account management
 */
import { ApiResponse } from '../../../core/api/apiClient';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types';
import { supabase } from '../../../integrations/supabase/client';

/**
 * Log in with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
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
};

/**
 * Register a new user
 */
export const signup = async (userData: SignupData): Promise<ApiResponse<AuthResponse>> => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        displayName: userData.displayName,
        role: userData.role
      }
    }
  });
  
  // Transform the response to match our expected AuthResponse type
  return {
    data: data.user ? {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        displayName: userData.displayName,
        role: userData.role,
      } as User,
      token: data.session?.access_token || ''
    } : null,
    error: error ? new Error(error.message) : null
  };
};

// Keep the rest of your functions as they are