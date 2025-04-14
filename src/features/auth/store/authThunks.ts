import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabaseService } from '@/integrations/supabase/supabaseService';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseService.auth.signInWithPassword(credentials);
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async ({ signupData, role, providerType }: { 
    signupData: any, 
    role?: string | null, 
    providerType?: string | null 
  }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseService.auth.signUp(
        signupData,
        role,
        providerType
      );
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const logout = createAsyncThunk(
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

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabaseService.auth.resetPasswordForEmail(email);
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Add a new thunk to handle role assignment
export const assignUserRole = createAsyncThunk(
  'auth/assignUserRole',
  async ({ userId, role, serviceType }: { 
    userId: string, 
    role: string,
    serviceType?: string 
  }, { rejectWithValue }) => {
    try {
      let result;
      
      if (role === 'pet_owner') {
        // Create pet owner record
        result = await supabaseService.createPetOwner(userId);
      } else if (role === 'service_provider') {
        // Create service provider record
        result = await supabaseService.createServiceProvider(userId);
        
        // If service type is provided, create the specific provider type
        if (serviceType === 'veterinarian') {
          await supabaseService.createVeterinarian(userId);
        } else if (serviceType === 'grooming') {
          await supabaseService.createPetGrooming(userId);
        }
        
        // Update provider type
        if (serviceType) {
          await supabaseService.updateProviderType(userId, serviceType);
        }
      }
      
      if (result?.error) {
        return rejectWithValue(result.error.message);
      }
      
      return { userId, role, serviceType };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Add a thunk to update service provider type
export const updateUserServiceType = createAsyncThunk(
  'auth/updateUserServiceType',
  async ({ userId, serviceType }: {
    userId: string,
    serviceType: string
  }, { rejectWithValue }) => {
    try {
      // Create the specific provider type record
      let typeResult;
      if (serviceType === 'veterinarian') {
        typeResult = await supabaseService.createVeterinarian(userId);
      } else if (serviceType === 'grooming') {
        typeResult = await supabaseService.createPetGrooming(userId);
      }
      
      if (typeResult?.error) {
        return rejectWithValue(typeResult.error.message);
      }
      
      // Update the provider type in the service_providers table
      const updateResult = await supabaseService.updateProviderType(userId, serviceType);
      
      if (updateResult?.error) {
        return rejectWithValue(updateResult.error.message);
      }
      
      return { userId, serviceType };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);
