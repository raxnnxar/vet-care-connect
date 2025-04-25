import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/integrations/supabase/client';
import { authActions } from '../authSlice';
import { ServiceTypeType } from '../../types/serviceTypes';

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
  async ({ userId, serviceType }: { userId: string; serviceType: ServiceTypeType }, { rejectWithValue, dispatch }) => {
    try {
      console.log(`Updating service type for user ${userId} to ${serviceType}`);
      
      // First check if the user has a service_provider record
      const { data: providerData, error: providerCheckError } = await supabase
        .from('service_providers')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (providerCheckError) {
        console.error('Error checking provider:', providerCheckError);
        throw providerCheckError;
      }
      
      // If no service_provider record exists, create one
      if (!providerData) {
        const { error: createProviderError } = await supabase
          .from('service_providers')
          .insert({ 
            id: userId, 
            provider_type: serviceType,
            created_at: new Date().toISOString() 
          });
        
        if (createProviderError) {
          console.error('Error creating service provider:', createProviderError);
          throw createProviderError;
        }
      } else {
        // Update the provider_type in the existing service_provider record
        const { error: updateProviderError } = await supabase
          .from('service_providers')
          .update({ 
            provider_type: serviceType, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId);
        
        if (updateProviderError) {
          console.error('Error updating provider type:', updateProviderError);
          throw updateProviderError;
        }
      }
      
      // Create specialized provider record based on service type
      if (serviceType === 'veterinarian') {
        // Check if veterinarian record already exists
        const { data: vetData, error: vetCheckError } = await supabase
          .from('veterinarians')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
          
        if (vetCheckError) {
          console.error('Error checking veterinarian record:', vetCheckError);
          throw vetCheckError;
        }
          
        if (!vetData) {
          const { error: vetError } = await supabase
            .from('veterinarians')
            .insert({ id: userId });
            
          if (vetError) {
            console.error('Error creating veterinarian record:', vetError);
            throw vetError;
          }
        }
      } else if (serviceType === 'grooming') {
        // Check if pet_grooming record already exists
        const { data: groomData, error: groomCheckError } = await supabase
          .from('pet_grooming')
          .select('id')
          .eq('id', userId)
          .maybeSingle();
          
        if (groomCheckError) {
          console.error('Error checking grooming record:', groomCheckError);
          throw groomCheckError;
        }
          
        if (!groomData) {
          const { error: groomerError } = await supabase
            .from('pet_grooming')
            .insert({ id: userId });
            
          if (groomerError) {
            console.error('Error creating pet grooming record:', groomerError);
            throw groomerError;
          }
        }
      }
      
      // Update the Redux store state
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
      
      // Update both profiles and pet_owners tables
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      const { error: petOwnerError } = await supabase
        .from('pet_owners')
        .update(updateData)
        .eq('id', userId);
      
      if (petOwnerError) throw petOwnerError;
      
      return { userId, phone, profileImage };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
