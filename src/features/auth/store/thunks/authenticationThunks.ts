
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { authActions } from '../authSlice';
import { User, LoginCredentials, SignupData, ProfileData } from '../../types';

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
      
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single();
      
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        throw profileCheckError;
      }
      
      if (!existingProfile) {
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
      }
      
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
