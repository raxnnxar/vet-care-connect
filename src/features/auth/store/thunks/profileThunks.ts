
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
          const { error: vetError } = await supabase.rpc('create_veterinarian', { 
            vet_id: userId 
          });
          
          if (vetError) {
            console.error('Error creating veterinarian record:', vetError);
            throw vetError;
          }
        } else if (serviceType === 'grooming') {
          const { error: groomerError } = await supabase.rpc('create_pet_grooming', { 
            groomer_id: userId 
          });
          
          if (groomerError) {
            console.error('Error creating pet grooming record:', groomerError);
            throw groomerError;
          }
        }
        
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
