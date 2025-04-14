
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabaseService } from '@/integrations/supabase/supabaseService';
import { supabase } from '@/integrations/supabase/client';
import { authApi } from '../api/authApi';
import { authActions } from './authSlice';

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(authActions.authRequestStarted());
      const { data, error } = await supabaseService.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        dispatch(authActions.authFailed(error.message));
        return rejectWithValue(error.message);
      }

      // Success - update auth state
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.displayName || '',
          role: data.user.user_metadata?.role,
          serviceType: data.user.user_metadata?.serviceType
        };
        dispatch(authActions.authSuccess(user));
        return user;
      }
      
      return rejectWithValue('Login failed - no user data returned');
    } catch (error) {
      dispatch(authActions.authFailed(error instanceof Error ? error.message : 'Unknown error'));
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Signup thunk
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(authActions.authRequestStarted());
      const { data, error } = await supabaseService.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: name,
          },
        },
      });

      if (error) {
        dispatch(authActions.authFailed(error.message));
        return rejectWithValue(error.message);
      }

      // Success - update auth state
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: name,
          // Role will be set in the post-signup flow
        };
        dispatch(authActions.authSuccess(user));
        return user;
      }
      
      return rejectWithValue('Signup failed - no user data returned');
    } catch (error) {
      dispatch(authActions.authFailed(error instanceof Error ? error.message : 'Unknown error'));
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(authActions.authRequestStarted());
      const { error } = await supabaseService.auth.signOut();

      if (error) {
        dispatch(authActions.authFailed(error.message));
        return rejectWithValue(error.message);
      }

      dispatch(authActions.logoutSuccess());
      return null;
    } catch (error) {
      dispatch(authActions.authFailed(error instanceof Error ? error.message : 'Unknown error'));
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Get current user thunk
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(authActions.authRequestStarted());
      const { data, error } = await supabaseService.auth.getUser();

      if (error) {
        dispatch(authActions.authFailed(error.message));
        return rejectWithValue(error.message);
      }

      if (data && data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.displayName || '',
          role: data.user.user_metadata?.role,
          serviceType: data.user.user_metadata?.serviceType
        };
        dispatch(authActions.authSuccess(user));
        return user;
      } else {
        dispatch(authActions.logoutSuccess());
        return null;
      }
    } catch (error) {
      dispatch(authActions.authFailed(error instanceof Error ? error.message : 'Unknown error'));
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Update user role thunk
export const assignUserRole = createAsyncThunk(
  'auth/assignUserRole',
  async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      console.log(`Assigning role ${role} to user ${userId}`);
      
      const { error, role: updatedRole } = await authApi.updateUserRole(userId, role);
      
      if (error) {
        console.error('Error in assignUserRole:', error);
        return rejectWithValue(error);
      }
      
      return { role: updatedRole };
    } catch (error) {
      console.error('Error in assignUserRole:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Update provider type thunk
export const updateProviderType = createAsyncThunk(
  'auth/updateProviderType',
  async ({ providerId, providerType }: { providerId: string; providerType: string }, { rejectWithValue }) => {
    try {
      console.log(`Updating provider type to ${providerType} for user ${providerId}`);
      
      const { error, providerType: updatedType } = await authApi.updateProviderType(providerId, providerType);
      
      if (error) {
        console.error('Error in updateProviderType:', error);
        return rejectWithValue(error);
      }

      return { providerType: updatedType };
    } catch (error) {
      console.error('Error in updateProviderType:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
