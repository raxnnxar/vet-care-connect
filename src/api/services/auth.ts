
/**
 * Authentication API services
 */
import { apiClient } from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';
import { User } from '../../core/types/user';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
  role: 'pet_owner' | 'veterinarian';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

// Auth API methods
export const authService = {
  /**
   * Log in a user with email and password
   */
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials),
  
  /**
   * Register a new user
   */
  signup: (data: SignupData) => 
    apiClient.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, data),
  
  /**
   * Request a password reset link
   */
  forgotPassword: (data: ForgotPasswordData) => 
    apiClient.post<{ message: string }>(AUTH_ENDPOINTS.FORGOT_PASSWORD, data),
  
  /**
   * Reset password with token
   */
  resetPassword: (data: ResetPasswordData) => 
    apiClient.post<{ message: string }>(AUTH_ENDPOINTS.RESET_PASSWORD, data),
  
  /**
   * Log out the current user
   */
  logout: () => 
    apiClient.post<{ message: string }>(AUTH_ENDPOINTS.LOGOUT),
};
