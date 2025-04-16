
import { useEffect, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import {
  loginUser,
  signupUser,
  logoutUser,
  checkAuthThunk,
} from '../store/authThunks';
import { authActions } from '../store/authSlice';
import { User, LoginCredentials, SignupData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector(state => state.auth);
  const [initialAuthCheckDone, setInitialAuthCheckDone] = useState(false);
  
  // Check for existing session on mount and set up auth state listener
  useEffect(() => {
    // First check for existing session
    const initAuth = async () => {
      try {
        // Wait for the auth check to complete
        await dispatch(checkAuthThunk());
        setInitialAuthCheckDone(true);
      } catch (error) {
        console.error('Error during initial auth check:', error);
        setInitialAuthCheckDone(true);
      }
    };

    // Set up the auth state change listener
    const { data: { subscription }} = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
      
      // Only dispatch actions after initial auth check to avoid duplicates
      if (initialAuthCheckDone) {
        if (session && session.user) {
          console.log("User session detected, updating state:", session.user);
          dispatch(authActions.authSuccess({
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.displayName || '',
            role: session.user.user_metadata?.role,
            serviceType: session.user.user_metadata?.serviceType
          }));
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          dispatch(authActions.logoutSuccess());
        }
      }
    });

    // Initialize auth
    initAuth();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, initialAuthCheckDone]);
  
  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    
    // Actions
    login: useCallback((credentials: LoginCredentials) => 
      dispatch(loginUser(credentials)), [dispatch]),
    signup: useCallback((userData: SignupData) => 
      dispatch(signupUser(userData)), [dispatch]),
    logout: useCallback(() => 
      dispatch(logoutUser()), [dispatch]),
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
