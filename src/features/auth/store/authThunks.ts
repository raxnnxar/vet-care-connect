import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabaseService } from '@/integrations/supabase/supabaseService';
import { supabase } from '@/integrations/supabase/client';

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseService.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Signup thunk
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseService.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabaseService.auth.signOut();

      if (error) {
        return rejectWithValue(error.message);
      }

      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Get current user thunk
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseService.auth.getUser();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
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
      
      // First, update the profiles table to set the correct role
      const profileUpdate = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', userId);
      
      console.log('Profile update result:', profileUpdate);
      
      if (profileUpdate.error) {
        console.error('Error updating profile:', profileUpdate.error);
        return rejectWithValue(profileUpdate.error.message);
      }
      
      if (role === 'pet_owner') {
        // Try the RPC function first
        const { data, error } = await supabaseService.createPetOwner(userId);
        console.log('Pet owner creation result:', { data, error });
        
        if (error) {
          console.error('Error creating pet owner with RPC, trying direct insert:', error);
          // Try direct insertion as fallback
          const insertResult = await supabase
            .from('pet_owners')
            .insert({ id: userId });
          
          if (insertResult.error) {
            console.error('Direct insert failed:', insertResult.error);
            return rejectWithValue(insertResult.error.message);
          }
        }
        
        return { role: 'pet_owner' };
      } else if (role === 'service_provider') {
        // For service providers, we'll just create the entry in the service_providers table
        // The specific type (veterinarian or grooming) will be set in the next screen
        
        // Try the RPC function first
        const { data, error } = await supabaseService.createServiceProvider(userId);
        console.log('Service provider creation result:', { data, error });
        
        if (error) {
          console.error('Error creating service provider with RPC, trying direct insert:', error);
          
          // Try with 'veterinarian' as a temporary value
          const insertResult = await supabase
            .from('service_providers')
            .insert({ 
              id: userId,
              provider_type: 'veterinarian' // Temporary value, will be updated in next screen
            });
          
          console.log('Direct insert result:', insertResult);
          
          if (insertResult.error) {
            console.error('Direct insert failed:', insertResult.error);
            return rejectWithValue(insertResult.error.message);
          }
        }
        
        return { role: 'service_provider' };
      }
      
      return rejectWithValue('Invalid role specified');
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
      
      // First update the provider_type in the service_providers table
      const { data, error } = await supabaseService.updateProviderType(providerId, providerType);
      console.log('Update provider type result:', { data, error });

      if (error) {
        console.error('Error updating provider type:', error);
        return rejectWithValue(error.message);
      }

      // Then create the specific provider type record
      if (providerType === 'veterinarian') {
        const vetResult = await supabaseService.createVeterinarian(providerId);
        console.log('Create veterinarian result:', vetResult);
        
        if (vetResult.error) {
          console.error('Error creating veterinarian record:', vetResult.error);
        }
      } else if (providerType === 'grooming') {
        const groomingResult = await supabaseService.createPetGrooming(providerId);
        console.log('Create pet grooming result:', groomingResult);
        
        if (groomingResult.error) {
          console.error('Error creating pet grooming record:', groomingResult.error);
        }
      }

      return { providerType };
    } catch (error) {
      console.error('Error in updateProviderType:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
