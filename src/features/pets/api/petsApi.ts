import { Pet, CreatePetData, UpdatePetData, PetFilters, PetMedicalHistory } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { QueryOptions } from '../../../core/api/apiClient';
import { IPetsApi } from './petsApiInterface';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

/**
 * API service for pet-related operations with Supabase
 */
export const petsApi: IPetsApi = {
  /**
   * Get all pets with optional filtering
   */
  async getPets(options?: QueryOptions & { filters?: PetFilters }) {
    try {
      let query = supabase.from('pets').select('*');
      
      // Apply filters if provided
      if (options?.filters) {
        const filters = options.filters;
        (Object.keys(filters) as Array<keyof PetFilters>).forEach((key) => {
          const value = filters[key];
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      console.error('Error in getPets:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Get a single pet by ID
   */
  async getPetById(id: string) {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*, pet_medical_history(*)')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error in getPetById:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Create a new pet
   */
  async createPet(petData: CreatePetData) {
    try {
      console.log('Creating pet with data:', petData);
      
      // Remove medicalHistory from pet creation data
      const { medicalHistory, ...petDetails } = petData;
      
      // First, insert the pet record only
      const { data: newPetData, error: petError } = await supabase
        .from('pets')
        .insert(petDetails)
        .select()
        .single();
      
      if (petError || !newPetData) {
        console.error('Error creating pet:', petError);
        return { data: null, error: petError };
      }
      
      console.log('Pet created successfully:', newPetData);
      return { data: newPetData, error: null };
    } catch (error) {
      console.error('Error in createPet:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Update an existing pet
   */
  async updatePet(id: string, petData: UpdatePetData) {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update(petData)
        .eq('id', id)
        .select();
      
      return { data: data?.[0] || null, error };
    } catch (error) {
      console.error('Error in updatePet:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Delete a pet
   */
  async deletePet(id: string) {
    try {
      const { data, error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);
      
      return { data, error };
    } catch (error) {
      console.error('Error in deletePet:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Get pets by owner ID
   */
  async getPetsByOwner(ownerId: string) {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', ownerId);
      
      return { data, error };
    } catch (error) {
      console.error('Error in getPetsByOwner:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Upload a pet profile picture
   */
  async uploadPetProfilePicture(petId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${petId}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('pet-profile-pictures')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('Error uploading pet profile picture:', error);
        throw error;
      }

      console.log('File uploaded successfully to path:', filePath);

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('pet-profile-pictures')
        .getPublicUrl(filePath);

      console.log('Public URL generated:', publicUrlData.publicUrl);

      // Update the pet record with the profile picture URL
      const { error: updateError } = await supabase
        .from('pets')
        .update({ profile_picture_url: publicUrlData.publicUrl })
        .eq('id', petId);

      if (updateError) {
        console.error('Error updating pet profile picture URL:', updateError);
        throw updateError;
      }

      console.log('Pet record updated with profile picture URL');
      return { data: { publicUrl: publicUrlData.publicUrl }, error: null };
    } catch (error) {
      console.error('Error in uploadPetProfilePicture:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Upload a vaccine document for a pet
   */
  async uploadVaccineDocument(petId: string, file: File) {
    try {
      console.log('API: Uploading vaccine document for pet ID:', petId);
      
      if (!petId) {
        throw new Error('Pet ID is required');
      }
      
      if (!file) {
        throw new Error('File is required');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${petId}/${Date.now()}_vaccine.${fileExt}`;
      const filePath = fileName;

      console.log('API: Attempting to upload vaccine document to path:', filePath);

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('pet-vaccine-documents')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) {
        console.error('API: Error uploading vaccine document:', error);
        throw error;
      }

      console.log('API: Vaccine document uploaded successfully');

      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('pet-vaccine-documents')
        .getPublicUrl(filePath);

      console.log('API: Public URL for vaccine document:', publicUrlData.publicUrl);

      // Check if a medical history record exists for this pet
      const { data: existingRecord, error: fetchError } = await supabase
        .from('pet_medical_history')
        .select('id')
        .eq('pet_id', petId)
        .maybeSingle();
        
      if (fetchError) {
        console.error('API: Error checking for existing medical history:', fetchError);
      }
      
      let updateError = null;
      
      if (existingRecord) {
        // Update existing record
        console.log('API: Updating existing medical history record');
        const { error } = await supabase
          .from('pet_medical_history')
          .update({ vaccines_document_url: publicUrlData.publicUrl })
          .eq('pet_id', petId);
          
        updateError = error;
      } else {
        // Create new record
        console.log('API: Creating new medical history record');
        const { error } = await supabase
          .from('pet_medical_history')
          .insert({ 
            pet_id: petId, 
            vaccines_document_url: publicUrlData.publicUrl 
          });
          
        updateError = error;
      }

      if (updateError) {
        console.error('API: Error updating pet medical history with vaccine document URL:', updateError);
        throw updateError;
      }

      return { data: { publicUrl: publicUrlData.publicUrl }, error: null };
    } catch (error) {
      console.error('API: Error in uploadVaccineDocument:', error);
      return { data: null, error: error as Error };
    }
  },
  
  /**
   * Create pet medical history
   */
  async createPetMedicalHistory(petId: string, medicalHistoryData: PetMedicalHistory) {
    try {
      // Prepare the data for insertion
      const recordData = {
        pet_id: petId,
        allergies: medicalHistoryData.allergies || null,
        chronic_conditions: medicalHistoryData.chronic_conditions || null,
        vaccines_document_url: medicalHistoryData.vaccines_document_url || null,
        current_medications: medicalHistoryData.current_medications ? 
          JSON.stringify(medicalHistoryData.current_medications) : null,
        previous_surgeries: medicalHistoryData.previous_surgeries ? 
          JSON.stringify(medicalHistoryData.previous_surgeries) : null
      };
      
      const { data, error } = await supabase
        .from('pet_medical_history')
        .insert(recordData)
        .select();
      
      if (error) {
        console.error('Error creating pet medical history:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Error in createPetMedicalHistory:', error);
      return { data: null, error: error as Error };
    }
  }
};
