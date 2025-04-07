
/**
 * User types
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'pet_owner' | 'veterinarian';
  profileImage?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
