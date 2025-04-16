
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthCredentials } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { UpdateProfileOptions } from '../types';

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error during sign in');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp(credentials);
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error during sign up');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error during sign out');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (options: UpdateProfileOptions, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: { user: any } };
      const userId = auth.user?.id;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }
      
      // Update pet owner profile in Supabase
      const { error } = await supabase
        .from('pet_owners')
        .update({
          phone_number: options.phone,
          profile_picture_url: options.profileImage
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating profile:', error);
        return rejectWithValue(error.message);
      }
      
      // If we have pets to store, we would do this:
      if (options.pets && options.pets.length > 0) {
        for (const pet of options.pets) {
          const { error: petError } = await supabase
            .from('pets')
            .insert({
              ...pet,
              owner_id: userId
            });
            
          if (petError) {
            console.error('Error adding pet:', petError);
            // Continue despite errors
          }
        }
      }
      
      return {
        phone: options.phone,
        profileImage: options.profileImage,
        pets: options.pets || []
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error updating profile');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data?.user || null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error getting current user');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error sending password reset email');
    }
  }
);
