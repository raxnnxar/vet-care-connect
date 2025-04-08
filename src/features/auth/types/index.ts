
/**
 * Authentication related types
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'pet_owner' | 'veterinarian';
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
  role: 'pet_owner' | 'veterinarian';
}

export interface AuthResponse {
  user: User;
  token: string;
}
