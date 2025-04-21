
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { authActions } from './authSlice';
import { User, LoginCredentials, SignupData, ProfileData } from '../types';
import { USER_ROLES } from '@/core/constants/app.constants';
import { ServiceTypeType } from '../types/serviceTypes';

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
      
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        return rejectWithValue(userError);
      }
      
      console.log('User data from database:', userData);
      
      const profileData = userData as ProfileData;
      
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        displayName: profileData?.display_name || '',
        role: profileData?.role || null,
        serviceType: profileData?.service_type || null,
        phone: profileData?.phone_number || '',
        profileImage: profileData?.profile_picture_url || null,
        service_type: profileData?.service_type || null,
        phone_number: profileData?.phone_number || '',
        profile_picture_url: profileData?.profile_picture_url || null,
      };
      
      console.log('Constructed user object with role:', user.role);
      
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
  async ({ email, password }: LoginCredentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(authActions.authRequestStarted());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) throw userError;
      
      const profileData = userData as ProfileData;
      
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: profileData?.display_name || '',
        role: profileData?.role,
        serviceType: profileData?.service_type,
        phone: profileData?.phone_number || '',
        profileImage: profileData?.profile_picture_url || null,
        service_type: profileData?.service_type || null,
        phone_number: profileData?.phone_number || '',
        profile_picture_url: profileData?.profile_picture_url || null,
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
  async ({ email, password, name }: SignupData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(authActions.authRequestStarted());
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: name,
            role: 'pet_owner'
          }
        }
      });
      
      if (error) throw error;
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user?.id,
          email: email,
          display_name: name,
          role: 'pet_owner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
      
      const user: User = {
        id: data.user!.id,
        email: email,
        displayName: name,
        role: 'pet_owner',
        serviceType: null,
        phone: '',
        profileImage: null,
        service_type: null,
        phone_number: '',
        profile_picture_url: null
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
  async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { userId, role };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateServiceType = createAsyncThunk(
  'auth/updateServiceType',
  async ({ userId, serviceType }: { userId: string; serviceType: string }, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ service_type: serviceType, updated_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
      
      return { userId, serviceType };
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
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (error) throw error;
      
      return { userId, phone, profileImage };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove the duplicate exports here - they're already exported individually above
