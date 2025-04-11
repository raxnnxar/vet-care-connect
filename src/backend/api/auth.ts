
import usersData from '../data/users.json';
import { User } from '../../features/auth/types';
import { supabase } from '../../integrations/supabase/client';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  displayName: string;
  role: string;
  serviceType?: string;
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

export const registerUser = async (data: SignupData): Promise<User> => {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.displayName,
          role: data.role,
          service_type: data.serviceType
        }
      }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    if (!authData.user) {
      throw new Error('Registration failed');
    }
    
    // Format user data to match our User type
    const user: User = {
      id: authData.user.id,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
    };
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
