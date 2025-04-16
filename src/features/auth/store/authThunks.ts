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
      
      // If we have pets to store, process each pet
      if (options.pets && options.pets.length > 0) {
        for (const pet of options.pets) {
          // Insert the pet data
          const { data: petData, error: petError } = await supabase
            .from('pets')
            .insert({
              name: pet.name,
              species: pet.species,
              breed: pet.breed || '',
              additional_notes: pet.additional_notes || '',
              weight: pet.weight || null,
              sex: pet.sex || null,
              temperament: pet.temperament || '',
              owner_id: userId,
              date_of_birth: pet.date_of_birth || null,
            })
            .select();
            
          if (petError) {
            console.error('Error adding pet:', petError);
            continue; // Continue despite errors
          }
          
          // If the pet has medical history, store it
          if (pet.medicalHistory && petData && petData[0]) {
            const petId = petData[0].id;
            
            const { error: medicalHistoryError } = await supabase
              .from('pet_medical_history')
              .insert({
                pet_id: petId,
                allergies: pet.medicalHistory.allergies || null,
                chronic_conditions: pet.medicalHistory.chronic_conditions || null,
                current_medications: pet.medicalHistory.current_medications?.length > 0 
                  ? pet.medicalHistory.current_medications 
                  : [],
                previous_surgeries: pet.medicalHistory.previous_surgeries?.length > 0
                  ? pet.medicalHistory.previous_surgeries
                  : [],
                vaccines_document_url: pet.medicalHistory.vaccines_document_url || null,
              });
              
            if (medicalHistoryError) {
              console.error('Error adding medical history:', medicalHistoryError);
            }
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

export const assignUserRole = createAsyncThunk(
  'auth/assignUserRole',
  async ({ userId, role }: AssignRoleParams, { rejectWithValue }) => {
    try {
      console.log(`Assigning role ${role} to user ${userId}`);
      
      if (role === 'pet_owner') {
        // Call create_pet_owner function
        const { data, error } = await supabase.rpc('create_pet_owner', {
          owner_id: userId
        });
        
        if (error) {
          console.error(`Error in create_pet_owner:`, error);
          return rejectWithValue(error.message);
        }
      } else if (role === 'service_provider') {
        // Call create_service_provider function
        const { data, error } = await supabase.rpc('create_service_provider', {
          provider_id: userId
        });
        
        if (error) {
          console.error(`Error in create_service_provider:`, error);
          return rejectWithValue(error.message);
        }
      } else {
        return rejectWithValue(`Invalid role: ${role}`);
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
