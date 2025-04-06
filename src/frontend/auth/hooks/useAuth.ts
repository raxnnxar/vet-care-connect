
import { useState } from 'react';
import { User } from '../types';
import { getUser } from '../../../backend/api/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // In a real app, this would be an API call to your authentication service
      const userData = await getUser({ email, password });
      setUser(userData);
      return userData;
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
};
