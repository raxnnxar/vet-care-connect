
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  serviceType?: string;
  phone?: string;
  profileImage?: string;
  // Database field mappings
  service_type?: string;
  phone_number?: string;
  profile_picture_url?: string;
}

export interface UpdateProfileOptions {
  phone: string;
  profileImage?: string | null;
  pets?: any[]; // Array of pet objects to be saved
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface AssignRoleParams {
  userId: string;
  role: string;
}

export interface UpdateProviderTypeParams {
  userId: string;
  providerType: string;
}

// Define the ProfileData interface to match the database structure
export interface ProfileData {
  id: string;
  email: string;
  display_name: string;
  role: string;
  service_type?: string;
  phone_number?: string;
  profile_picture_url?: string;
  created_at?: string;
  updated_at?: string;
}
