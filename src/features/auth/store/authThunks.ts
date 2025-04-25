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
  async ({ userId, serviceType }: { userId: string; serviceType: string }, { rejectWithValue, dispatch }) => {
    try {
      console.log(`Updating service type for user ${userId} to ${serviceType}`);
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          service_type: serviceType, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (userError) {
        console.error('Error fetching user role:', userError);
        throw userError;
      }
      
      if (userData?.role === 'service_provider') {
        if (serviceType === 'veterinarian') {
          console.log('Creating veterinarian record');
          const { error: vetError } = await supabase.rpc('create_veterinarian', { 
            vet_id: userId 
          });
          
          if (vetError) {
            console.error('Error creating veterinarian record:', vetError);
            throw vetError;
          }
        } else if (serviceType === 'grooming') {
          console.log('Creating pet grooming record');
          const { error: groomerError } = await supabase.rpc('create_pet_grooming', { 
            groomer_id: userId 
          });
          
          if (groomerError) {
            console.error('Error creating pet grooming record:', groomerError);
            throw groomerError;
          }
        }
        
        console.log('Updating provider type');
        const { error: providerTypeError } = await supabase.rpc('update_provider_type', { 
          provider_id: userId, 
          provider_type_val: serviceType 
        });
        
        if (providerTypeError) {
          console.error('Error updating provider type:', providerTypeError);
          throw providerTypeError;
        }
      }
      
      dispatch(authActions.updateServiceType(serviceType));
      
      return { userId, serviceType };
    } catch (error: any) {
      console.error('Error in updateServiceType thunk:', error);
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
