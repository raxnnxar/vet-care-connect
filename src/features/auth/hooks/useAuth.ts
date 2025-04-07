
/**
 * Authentication hook for managing user authentication state
 */
import { useState, useContext, createContext, useEffect } from 'react';
import { User } from '../../../core/types/user';
import { authService, LoginCredentials, SignupData } from '../../../api/services/auth';
import { useLocalStorage } from '../../../core/hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useLocalStorage<string | null>('auth_token', null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if token exists and fetch user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        // TODO: Implement token validation and user data fetching
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.signup(data);
      
      setUser(response.user);
      setToken(response.token);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (token) {
        await authService.logout();
      }
      
      setUser(null);
      setToken(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
