
import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import {
  loginUser as loginThunk,
  signupUser as signupThunk,
  logoutUser as logoutThunk,
  getCurrentUser as checkAuthThunk,
} from '../store/authThunks';
import { authActions } from '../store/authSlice';
import { User, LoginCredentials, SignupData } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  
  // Check for existing session on mount
  useEffect(() => {
    if (!user) {
      dispatch(checkAuthThunk());
    }
  }, [dispatch, user]);
  
  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    
    // Actions
    login: useCallback((credentials: LoginCredentials) => 
      dispatch(loginThunk(credentials)), [dispatch]),
    signup: useCallback((userData: { email: string; password: string; name: string }) => 
      dispatch(signupThunk(userData)), [dispatch]),
    logout: useCallback(() => 
      dispatch(logoutThunk()), [dispatch]),
    updateProfile: useCallback((userData: Partial<User>) => 
      dispatch(authActions.profileUpdateSuccess(userData as User)), [dispatch]),
    clearErrors: useCallback(() => 
      dispatch(authActions.clearErrors()), [dispatch]),
  };
};

// Export a provider version of the AuthProvider for backward compatibility
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // This component now just passes through children since Redux Provider
  // should be handling state management at the app level
  return <>{children}</>;
};
