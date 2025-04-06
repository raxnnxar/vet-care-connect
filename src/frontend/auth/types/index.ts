
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
