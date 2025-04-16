
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role?: string;
  // Additional user fields as needed
}

export interface UpdateProfileOptions {
  phone: string;
  profileImage?: string | null;
  pets?: any[]; // Array of pet objects to be saved
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
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
