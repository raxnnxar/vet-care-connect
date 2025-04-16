
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
  async (filters?: PetFilters, { rejectWithValue }) => {
    try {
      const response = await petsApi.getAllPets(filters);
      return response;
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
      const response = await petsApi.getPetById(id);
      return response;
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
      const petResponse = await petsApi.createPet(petData);
      
      // If there's medical history data, create a related entry
      if (petData.medicalHistory && petResponse.id) {
        try {
          const medicalHistoryData = {
            ...petData.medicalHistory,
            pet_id: petResponse.id,
          };
          
          await petsApi.createPetMedicalHistory(petResponse.id, medicalHistoryData);
        } catch (medError) {
          console.error('Error creating medical history:', medError);
          // We don't reject here since pet was already created
        }
      }
      
      return petResponse;
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
      const response = await petsApi.updatePet(id, petData);
      return response;
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
      await petsApi.deletePet(id);
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
      const response = await petsApi.getPetsByOwner(ownerId);
      return response;
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
  async ({ petId, file }: UploadParams, { rejectWithValue }) => {
    try {
      // Use the specific pattern for pet profile pictures: {pet_id}/profile.jpg
      const fileExt = file.name.split('.').pop();
      const filePath = `${petId}/profile.${fileExt}`;
      
      // Upload to the pet-profile-pictures bucket
      const { data, error } = await supabase.storage
        .from('pet-profile-pictures')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('pet-profile-pictures')
        .getPublicUrl(filePath);
        
      const url = publicUrlData.publicUrl;
      
      // Update the pet record with the profile picture URL
      await petsApi.updatePet(petId, { profile_picture_url: url });
      
      return { url, petId };
    } catch (error) {
      console.error('Error uploading pet profile picture:', error);
      return rejectWithValue(error);
    }
  }
);
