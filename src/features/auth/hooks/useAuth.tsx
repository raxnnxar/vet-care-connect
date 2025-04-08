
/**
 * Custom hook for managing user authentication
 */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useLocalStorage } from '../../../core/hooks/useLocalStorage';
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getCurrentUser,
  updateUserProfile
} from '../api/authApi';
import { User, LoginCredentials, SignupData } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  signup: (userData: SignupData) => Promise<User | null>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User | null>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Auth Provider component
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useLocalStorage<string | null>('auth_token', null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        setIsLoading(true);
        try {
          const { data, error } = await getCurrentUser();
          
          if (error) throw error;
          setUser(data);
        } catch (err) {
          console.error('Error retrieving user session:', err);
          // Clear invalid token
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuthStatus();
  }, [token, setToken]);

  /**
   * Log in a user with email and password
   */
  const login = useCallback(async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await apiLogin(credentials);
      
      if (error) throw error;
      
      setUser(data?.user || null);
      setToken(data?.token || null);
      return data?.user || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  /**
   * Register a new user
   */
  const signup = useCallback(async (userData: SignupData): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await apiSignup(userData);
      
      if (error) throw error;
      
      setUser(data?.user || null);
      setToken(data?.token || null);
      return data?.user || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  /**
   * Log out the current user
   */
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await apiLogout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, [setToken]);

  /**
   * Update the user's profile
   */
  const updateProfile = useCallback(async (userData: Partial<User>): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await updateUserProfile(userData);
      
      if (error) throw error;
      
      setUser(prevUser => prevUser ? { ...prevUser, ...data } as User : null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(new Error(errorMessage));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auth context value
  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use authentication context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
