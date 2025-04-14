
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabaseService } from '@/integrations/supabase/supabaseService';
import { supabase } from '@/integrations/supabase/client';

// Define types for RPC parameters to avoid TypeScript errors
interface RpcParams {
  [key: string]: any;
}

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
      
      // CRITICAL FIX: First update the user metadata to include the role
      // This ensures the session has the right role information
      const { data: userData, error: userError } = await supabase.auth.updateUser({
        data: { role }
      });
      
      if (userError) {
        console.error('Error updating user metadata:', userError);
        return rejectWithValue(userError.message);
      }
      
      console.log('User metadata update result:', userData);
      
      // Then, update the profiles table to set the correct role
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
        const params: RpcParams = { owner_id: userId };
        const { data, error } = await supabase.rpc('create_pet_owner', params);
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
        const params: RpcParams = { provider_id: userId };
        const { data, error } = await supabase.rpc('create_service_provider', params);
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
      
      // CRITICAL FIX: First update the user metadata to include the service type
      const { data: userData, error: userError } = await supabase.auth.updateUser({
        data: { serviceType: providerType }
      });
      
      if (userError) {
        console.error('Error updating user metadata:', userError);
        return rejectWithValue(userError.message);
      }
      
      console.log('User metadata update result:', userData);
      
      // Then update the provider_type in the service_providers table
      const params: RpcParams = { 
        provider_id: providerId, 
        provider_type_val: providerType 
      };
      const { data, error } = await supabase.rpc('update_provider_type', params);
      console.log('Update provider type result:', { data, error });

      if (error) {
        console.error('Error updating provider type:', error);
        return rejectWithValue(error.message);
      }

      // Then create the specific provider type record
      if (providerType === 'veterinarian') {
        const vetParams: RpcParams = { vet_id: providerId };
        const vetResult = await supabase.rpc('create_veterinarian', vetParams);
        console.log('Create veterinarian result:', vetResult);
        
        if (vetResult.error) {
          console.error('Error creating veterinarian record:', vetResult.error);
        }
      } else if (providerType === 'grooming') {
        const groomerParams: RpcParams = { groomer_id: providerId };
        const groomingResult = await supabase.rpc('create_pet_grooming', groomerParams);
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
