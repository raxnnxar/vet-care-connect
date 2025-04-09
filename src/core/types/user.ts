
/**
 * User types
 */
import { USER_ROLES, UserRoleType } from '../constants/app.constants';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRoleType;
  profileImage?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}
