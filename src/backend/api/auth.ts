
import usersData from '../data/users.json';
import { User } from '../../frontend/auth/types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const getUser = async (credentials: LoginCredentials): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = usersData.find(u => 
    u.email === credentials.email && u.password === credentials.password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Don't return the password in the user object
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
};
