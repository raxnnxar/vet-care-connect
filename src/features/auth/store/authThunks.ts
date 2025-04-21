import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '../api/profileService';

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create user profile in the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user?.id,
            email,
            display_name: displayName,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (userError) throw userError;

      return {
        id: data.user?.id,
        email: data.user?.email,
        displayName,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      return {
        id: data.user.id,
        email: data.user.email,
        displayName: userData.display_name,
        role: userData.role,
        serviceType: userData.service_type,
        phone: userData.phone_number,
        profileImage: userData.profile_picture_url,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
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

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Checking auth state...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        console.log('No active session found');
        return null;
      }
      
      console.log('Active session found, user:', session.user);
      
      // Fetch user profile data including role from your database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }
      
      console.log('User data from database:', userData);
      
      // Return combined user data
      return {
        id: session.user.id,
        email: session.user.email,
        displayName: userData?.display_name || '',
        role: userData?.role || null,
        serviceType: userData?.service_type || null,
        phone: userData?.phone_number || '',
        profileImage: userData?.profile_picture_url || null,
      };
    } catch (error) {
      console.error('Auth check error:', error);
      return rejectWithValue(error);
    }
  }
);

export const assignUserRole = createAsyncThunk(
  'auth/assignUserRole',
  async ({ userId, role }: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      console.log(`Assigning role ${role} to user ${userId}`);
      
      // Update the user's role in the database
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      console.log('Role update successful:', data);
      
      return { userId, role, userData: data[0] };
    } catch (error: any) {
      console.error('Error in assignUserRole:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: any, { getState, rejectWithValue }) => {
    try {
      console.log('Updating profile...');
      const { auth } = getState() as { auth: { user: any } };
      const userId = auth.user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Update user profile in the database
      const { data, error } = await supabase
        .from('users')
        .update({
          phone_number: profileData.phone,
          profile_picture_url: profileData.profileImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      console.log('Profile updated, waiting for state to update...', data);
      
      // Fetch the complete user data to ensure we have all fields
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error('Error fetching updated user data:', userError);
        throw userError;
      }
      
      return {
        id: userId,
        email: auth.user.email,
        displayName: userData.display_name,
        role: userData.role,
        serviceType: userData.service_type,
        phone: userData.phone_number,
        profileImage: userData.profile_picture_url,
      };
    } catch (error: any) {
      console.error('Profile update error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateServiceType = createAsyncThunk(
  'auth/updateServiceType',
  async ({ userId, serviceType }: { userId: string; serviceType: string }, { rejectWithValue }) => {
    try {
      // Update the user's service type in the database
      const { data, error } = await supabase
        .from('users')
        .update({ service_type: serviceType })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      
      return { userId, serviceType, userData: data[0] };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
