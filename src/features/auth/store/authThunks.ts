import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { authActions } from './authSlice';
import { User } from '../types';
import { USER_ROLES, UserRoleType } from '@/core/constants/app.constants';
import { ServiceTypeType } from '../screens/ServiceTypeSelectionScreen';

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log('Checking auth state...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        console.log('No active session found');
        dispatch(authActions.logoutSuccess());
        return null;
      }
      
      console.log('Active session found, user:', session.user);
      
      // Always fetch fresh user data from the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        return rejectWithValue(userError);
      }
      
      console.log('User data from database:', userData);
      
      // Create the user object with all necessary data
      const user = {
        id: session.user.id,
        email: session.user.email || '',
        displayName: userData?.display_name || '',
        role: userData?.role || null,
        serviceType: userData?.service_type || null,
        phone: userData?.phone_number || '',
        profileImage: userData?.profile_picture_url || null,
      };
      
      console.log('Constructed user object with role:', user.role);
      
      // Dispatch the authSuccess action to update the state
      dispatch(authActions.authSuccess(user));
      
      return user;
    } catch (error) {
      console.error('Auth check error:', error);
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(authActions.authRequestStarted());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) throw userError;
      
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: userData?.display_name || '',
        role: userData?.role as UserRoleType,
        serviceType: userData?.service_type as ServiceTypeType,
        phone: userData?.phone_number || '',
        profileImage: userData?.profile_picture_url || null
      };
      
      dispatch(authActions.authSuccess(user));
      return user;
    } catch (error: any) {
      dispatch(authActions.authFailed(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(authActions.authRequestStarted());
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName
          }
        }
      });
      
      if (error) throw error;
      
      // Create a user record in the users table
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user?.id,
          email: email,
          display_name: displayName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      const user: User = {
        id: data.user!.id,
        email: email,
        displayName: displayName,
        role: null,
        serviceType: null,
        phone: '',
        profileImage: null
      };
      
      dispatch(authActions.authSuccess(user));
      return user;
    } catch (error: any) {
      dispatch(authActions.authFailed(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignUserRole = createAsyncThunk(
  'auth/assignRole',
  async ({ userId, role }: { userId: string; role: UserRoleType }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { userId, role };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProviderType = createAsyncThunk(
  'auth/updateProviderType',
  async ({ userId, providerType }: { userId: string; providerType: ServiceTypeType }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ service_type: providerType, updated_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { userId, providerType };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, phone, profileImage }: { userId: string; phone: string; profileImage?: string }, { rejectWithValue }) => {
    try {
      const updateData: any = {
        phone_number: phone,
        updated_at: new Date().toISOString()
      };
      
      if (profileImage) {
        updateData.profile_picture_url = profileImage;
      }
      
      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId);
      
      if (error) throw error;
      
      return { userId, phone, profileImage };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
