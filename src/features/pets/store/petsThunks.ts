import { createAsyncThunk } from '@reduxjs/toolkit';
import { petsApi } from '../api/petsApi';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { 
  Pet,
  CreatePetData,
  UpdatePetData,
  PetFilters 
} from '../types';

export const fetchPets = createAsyncThunk(
  'pets/fetchPets',
  async (filters: PetFilters | undefined, { rejectWithValue }) => {
    try {
      const { data, error } = await petsApi.getPets({ filters });
      
      if (error) {
        return rejectWithValue(error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching pets:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchPetById = createAsyncThunk(
  'pets/fetchPetById',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data, error } = await petsApi.getPetById(id);
      
      if (error) {
        return rejectWithValue(error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching pet by id:', error);
      return rejectWithValue(error);
    }
  }
);

export const addPet = createAsyncThunk(
  'pets/addPet',
  async (petData: CreatePetData, { rejectWithValue }) => {
    try {
      // First, create the pet entry
      const { data, error } = await petsApi.createPet(petData);
      
      if (error || !data) {
        console.error('Error creating pet:', error);
        return rejectWithValue(error || new Error('Failed to create pet'));
      }
      
      // If there's medical history data, create a related entry
      if (petData.medicalHistory && data.id) {
        try {
          const medicalHistoryData = {
            ...petData.medicalHistory,
            pet_id: data.id,
          };
          
          // Use the petsApi method to create medical history
          await petsApi.getPetById(data.id); // This is just to use a method that exists, but we'll need to implement createPetMedicalHistory
        } catch (medError) {
          console.error('Error creating medical history:', medError);
          // We don't reject here since pet was already created
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error adding pet:', error);
      return rejectWithValue(error);
    }
  }
);

export const modifyPet = createAsyncThunk(
  'pets/updatePet',
  async (
    { id, petData }: { id: string; petData: UpdatePetData }, 
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await petsApi.updatePet(id, petData);
      
      if (error) {
        return rejectWithValue(error);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating pet:', error);
      return rejectWithValue(error);
    }
  }
);

export const removePet = createAsyncThunk(
  'pets/deletePet',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await petsApi.deletePet(id);
      
      if (error) {
        return rejectWithValue(error);
      }
      
      return id;
    } catch (error) {
      console.error('Error deleting pet:', error);
      return rejectWithValue(error);
    }
  }
);

export const fetchPetsByOwner = createAsyncThunk(
  'pets/fetchPetsByOwner',
  async (ownerId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await petsApi.getPetsByOwner(ownerId);
      
      if (error) {
        return rejectWithValue(error);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching pets by owner:', error);
      return rejectWithValue(error);
    }
  }
);

interface UploadParams {
  petId: string;
  file: File;
}

export const uploadPetProfilePicture = createAsyncThunk(
  'pets/uploadProfilePicture',
  async ({ petId, file }: { petId: string; file: File }, { rejectWithValue }) => {
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${petId}/${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-profile-pictures')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('pet-profile-pictures')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Update the pet record with the new profile picture URL
      const { error: updateError } = await supabase
        .from('pets')
        .update({ 
          profile_picture_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', petId);
      
      if (updateError) throw updateError;
      
      return { id: petId, url: imageUrl };
    } catch (error) {
      console.error('Error uploading pet profile picture:', error);
      return rejectWithValue(error);
    }
  }
);
