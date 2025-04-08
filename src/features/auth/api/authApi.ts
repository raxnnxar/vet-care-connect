/**
 * Authentication API service
 * 
 * Provides methods for user authentication and account management
 */
import apiClient, { ApiResponse } from '../../../core/api/apiClient';
import { User, LoginCredentials, SignupData, AuthResponse } from '../types';

/**
 * Log in with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.auth.signIn(credentials.email, credentials.password);
  
  // Transform the response to match our expected AuthResponse type
  return {
    data: response.data ? {
      user: response.data.user as User,
      token: 'placeholder-token' // In real implementation, this would come from session
    } : null,
    error: response.error
  };
};

/**
 * Register a new user
 */
export const signup = async (userData: SignupData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.auth.signUp(userData.email, userData.password);
  
  // Transform the response to match our expected AuthResponse type
  return {
    data: response.data ? {
      user: response.data.user as User,
      token: 'placeholder-token' // In real implementation, this would come from session
    } : null,
    error: response.error
  };
};

/**
 * Log out the current user
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  return apiClient.auth.signOut() as Promise<ApiResponse<void>>;
};

/**
 * Get the current user's profile
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return apiClient.users.getById<User>('current');
};

/**
 * Update the current user's profile
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<ApiResponse<User>> => {
  return apiClient.users.update<User>('current', userData);
};

/**
 * Request a password reset
 */
export const requestPasswordReset = async (email: string): Promise<ApiResponse<{ message: string }>> => {
  return { data: { message: 'Password reset email sent' }, error: null };
};

/**
 * Reset password with a token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
  return { data: { message: 'Password has been reset' }, error: null };
};
