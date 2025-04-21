
import { useEffect, useCallback, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import {
  loginUser,
  signupUser,
  logoutUser,
  checkAuthThunk,
} from '../store/authThunks';
import { authActions } from '../store/authSlice';
import { User, LoginCredentials, SignupData, ProfileData } from '../types';
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
    const { data: { subscription }} = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session ? "exists" : "none");
      
      if (session) {
        console.log("User session detected, updating state:", session.user);
        
        // Instead of just using metadata, fetch the complete user data from the database
        try {
          // Fetch user profile data including role from your database
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }
          
          console.log('User data from database:', userData);
          
          // Create the user object with all necessary data
          // Explicitly handle as ProfileData to ensure type safety
          const profileData = userData as ProfileData;
          
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: profileData?.display_name || '',
            role: profileData?.role || null,
            phone: profileData?.phone_number || '',
            profileImage: profileData?.profile_picture_url || null,
            // Store the original database field names too
            service_type: profileData?.service_type || null,
            phone_number: profileData?.phone_number || '',
            profile_picture_url: profileData?.profile_picture_url || null,
            serviceType: profileData?.service_type || null,
          };
          
          console.log('Constructed user object with role:', user.role);
          
          // Dispatch the authSuccess action to update the state
          dispatch(authActions.authSuccess(user));
        } catch (error) {
          console.error('Error handling auth state change:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, clearing state");
        dispatch(authActions.logoutSuccess());
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
