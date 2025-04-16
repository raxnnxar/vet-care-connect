
import { Pet, CreatePetData, UpdatePetData, PetFilters } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { QueryOptions } from '../../../core/api/apiClient';
import { IPetsApi } from './petsApiInterface';

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
        .select('*')
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
      const { data, error } = await supabase
        .from('pets')
        .insert(petData)
        .select();
      
      return { data: data?.[0] || null, error };
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
  }
};
