
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { authActions } from '../authSlice';
import { User, ProfileData } from '../../types';

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
      
      dispatch(authActions.authSuccess(user));
      return user;
    } catch (error) {
      console.error('Auth check error:', error);
      return rejectWithValue(error);
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
