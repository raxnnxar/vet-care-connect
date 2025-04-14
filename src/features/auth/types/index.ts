
/**
 * Authentication related types
 * 
 * These types define the shape of authentication data in the application
 */
import { USER_ROLES, UserRoleType } from '@/core/constants/app.constants';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRoleType;
  serviceType?: string;
  profileImage?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
  role: UserRoleType;
  serviceType?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}
