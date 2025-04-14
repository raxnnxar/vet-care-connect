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
        // Try the RPC function first
        const { data, error } = await supabaseService.createServiceProvider(userId);
        console.log('Service provider creation result:', { data, error });
        
        if (error) {
          console.error('Error creating service provider with RPC, trying direct insert:', error);
          
          // Try with 'veterinarian' first
          let insertResult = await supabase
            .from('service_providers')
            .insert({ 
              id: userId,
              provider_type: 'veterinarian' 
            });
          
          console.log('Direct insert result with veterinarian:', insertResult);
          
          // If that fails, try with 'grooming'
          if (insertResult.error) {
            console.error('Direct insert with veterinarian failed, trying grooming:', insertResult.error);
            
            insertResult = await supabase
              .from('service_providers')
              .insert({ 
                id: userId,
                provider_type: 'grooming' 
              });
            
            console.log('Direct insert result with grooming:', insertResult);
            
            if (insertResult.error) {
              console.error('All direct insert attempts failed:', insertResult.error);
              return rejectWithValue(insertResult.error.message);
            }
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
      const { data, error } = await supabaseService.updateProviderType(providerId, providerType);

      if (error) {
        return rejectWithValue(error.message);
      }

      // Create the specific provider type record
      if (providerType === 'veterinarian') {
        await supabaseService.createVeterinarian(providerId);
      } else if (providerType === 'grooming') {
        await supabaseService.createPetGrooming(providerId);
      }

      return { providerType };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
