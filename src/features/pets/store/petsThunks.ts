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
      console.log('addPet thunk called with data:', petData);
      
      // First, create the pet entry
      const { data, error } = await petsApi.createPet(petData);
      
      if (error || !data) {
        console.error('Error creating pet:', error);
        return rejectWithValue(error || new Error('Failed to create pet'));
      }
      
      console.log('Pet created successfully in API:', data);
      
      // If there's medical history data, create a related entry
      if (petData.medicalHistory && data.id) {
        try {
          const medicalHistoryData = {
            ...petData.medicalHistory,
            pet_id: data.id,
          };
          
          // Use the petsApi method to create medical history
          const { error: medHistoryError } = await supabase
            .from('pet_medical_history')
            .insert(medicalHistoryData);
            
          if (medHistoryError) {
            console.error('Error creating medical history:', medHistoryError);
          }
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
      console.log('Uploading profile picture for pet:', petId);
      
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
      
      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError);
        throw uploadError;
      }
      
      console.log('File uploaded successfully:', uploadData);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('pet-profile-pictures')
        .getPublicUrl(filePath);
      
      const imageUrl = publicUrlData.publicUrl;
      console.log('Uploaded image URL:', imageUrl);
      
      // Update the pet record with the new profile picture URL
      const { error: updateError } = await supabase
        .from('pets')
        .update({ 
          profile_picture_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', petId);
      
      if (updateError) {
        console.error('Error updating pet record with image URL:', updateError);
        throw updateError;
      }
      
      console.log('Pet record updated with profile picture URL');
      return { id: petId, url: imageUrl };
    } catch (error) {
      console.error('Error uploading pet profile picture:', error);
      return rejectWithValue(error);
    }
  }
);

export const uploadVaccineDocument = createAsyncThunk(
  'pets/uploadVaccineDocument',
  async ({ petId, file }: { petId: string; file: File }, { rejectWithValue }) => {
    try {
      console.log('Uploading vaccine document for pet:', petId);
      
      // Check if pet ID exists
      if (!petId) {
        console.error('Missing pet ID for vaccine document upload');
        return rejectWithValue(new Error('Missing pet ID'));
      }
      
      // Validate file
      if (!file) {
        console.error('No file provided for vaccine document upload');
        return rejectWithValue(new Error('No file provided'));
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `${petId}/${Date.now()}_vaccine.${fileExt}`;
      
      console.log('Attempting to upload vaccine document with path:', filePath);
      
      // First, check if the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'pet-vaccine-documents');
      
      if (!bucketExists) {
        console.error('Bucket pet-vaccine-documents does not exist');
        
        // Create the bucket if it doesn't exist (this requires admin privileges)
        try {
          // Instead, we'll try to use the bucket anyway and handle any errors
          console.log('Attempting to use bucket even though it may not exist');
        } catch (bucketError) {
          console.error('Error with bucket:', bucketError);
          return rejectWithValue(new Error('Storage bucket for vaccine documents not available'));
        }
      }
      
      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-vaccine-documents')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
      
      if (uploadError) {
        console.error('Error uploading vaccine document to storage:', uploadError);
        throw uploadError;
      }
      
      console.log('Vaccine document uploaded successfully:', uploadData);
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('pet-vaccine-documents')
        .getPublicUrl(filePath);
      
      const documentUrl = publicUrlData.publicUrl;
      console.log('Uploaded document URL:', documentUrl);
      
      // Save to vaccine_documents table instead of pet_medical_history
      const { error: insertError } = await supabase
        .from('vaccine_documents')
        .insert({
          pet_id: petId,
          document_url: documentUrl,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id || null
        });
      
      if (insertError) {
        console.error('Error saving vaccine document record:', insertError);
        throw insertError;
      }
      
      console.log('Vaccine document record saved successfully');
      return { id: petId, url: documentUrl };
    } catch (error) {
      console.error('Error uploading vaccine document:', error);
      return rejectWithValue(error);
    }
  }
);
