
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthCredentials, UpdateProfileOptions, AssignRoleParams, UpdateProviderTypeParams, LoginCredentials, SignupData } from '../types';
import { supabase } from '@/integrations/supabase/client';

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

// Add the missing functions that are imported elsewhere
export const assignUserRole = createAsyncThunk(
  'auth/assignUserRole',
  async ({ userId, role }: AssignRoleParams, { rejectWithValue }) => {
    try {
      console.log(`Assigning role ${role} to user ${userId}`);
      
      let functionToCall = '';
      
      if (role === 'pet_owner') {
        functionToCall = 'create_pet_owner';
      } else if (role === 'service_provider') {
        functionToCall = 'create_service_provider';
      } else {
        return rejectWithValue(`Invalid role: ${role}`);
      }
      
      // Call the appropriate database function
      const { data, error } = await supabase.rpc(functionToCall, {
        [role === 'pet_owner' ? 'owner_id' : 'provider_id']: userId
      });
      
      if (error) {
        console.error(`Error in ${functionToCall}:`, error);
        return rejectWithValue(error.message);
      }
      
      // Also update the user's role in the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);
      
      if (updateError) {
        console.error('Error updating profile role:', updateError);
        return rejectWithValue(updateError.message);
      }
      
      return { role };
    } catch (error: any) {
      console.error('Error assigning role:', error);
      return rejectWithValue(error.message || 'Error assigning user role');
    }
  }
);

export const updateProviderType = createAsyncThunk(
  'auth/updateProviderType',
  async ({ providerId, providerType }: UpdateProviderTypeParams, { rejectWithValue }) => {
    try {
      console.log(`Updating provider type to ${providerType} for user ${providerId}`);
      
      // Call the update_provider_type function
      const { error } = await supabase.rpc('update_provider_type', {
        provider_id: providerId,
        provider_type_val: providerType
      });
      
      if (error) {
        console.error('Error updating provider type:', error);
        return rejectWithValue(error.message);
      }
      
      // If provider type is veterinarian, also create a record in the veterinarians table
      if (providerType === 'veterinarian') {
        const { error: vetError } = await supabase.rpc('create_veterinarian', {
          vet_id: providerId
        });
        
        if (vetError) {
          console.error('Error creating veterinarian record:', vetError);
          // Continue despite this error
        }
      }
      
      // If provider type is grooming, create a record in the pet_groomers table
      if (providerType === 'grooming') {
        const { error: groomerError } = await supabase.rpc('create_pet_grooming', {
          groomer_id: providerId
        });
        
        if (groomerError) {
          console.error('Error creating pet groomer record:', groomerError);
          // Continue despite this error
        }
      }
      
      return { providerType };
    } catch (error: any) {
      console.error('Error updating provider type:', error);
      return rejectWithValue(error.message || 'Error updating provider type');
    }
  }
);

// Add additional functions needed in other files
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error during login');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            displayName: userData.name || userData.email.split('@')[0]
          }
        }
      });
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error during signup');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error during logout');
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return rejectWithValue(error.message);
      }
      
      return data.session?.user || null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error checking auth state');
    }
  }
);
