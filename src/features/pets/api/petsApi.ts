
/**
 * Pets API service
 * 
 * Provides methods for interacting with pet data in the database
 */
import apiClient, { ApiResponse, QueryOptions } from '../../../core/api/apiClient';
import { Pet, CreatePetData, UpdatePetData } from '../types';
import { IPetsApi } from './petsApiInterface';
import { PET_ENDPOINTS } from '../../../api/endpoints';

/**
 * Implementation of the Pets API interface
 */
class PetsApiService implements IPetsApi {
  /**
   * Get all pets with optional filtering
   */
  async getPets(options?: QueryOptions): Promise<ApiResponse<Pet[]>> {
    return apiClient.pets.select<Pet>(options);
  }

  /**
   * Get a single pet by ID
   */
  async getPetById(id: string): Promise<ApiResponse<Pet>> {
    return apiClient.pets.getById<Pet>(id);
  }

  /**
   * Create a new pet
   */
  async createPet(petData: CreatePetData): Promise<ApiResponse<Pet>> {
    // Transform the CreatePetData to be compatible with what the API client expects
    const transformedData: Partial<Pet> = { 
      ...petData,
      // If medicalHistory exists, ensure each record has a temporary id for type compatibility
      medicalHistory: petData.medicalHistory ? 
        petData.medicalHistory.map(record => ({
          ...record, 
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Temporary ID that will be replaced by the backend
        })) : 
        undefined
    };
    
    return apiClient.pets.insert<Pet>(transformedData);
  }

  /**
   * Update an existing pet
   */
  async updatePet(id: string, petData: UpdatePetData): Promise<ApiResponse<Pet>> {
    // Transform the UpdatePetData to be compatible with what the API client expects
    const transformedData: Partial<Pet> = {
      ...petData,
      // If medicalHistory exists, ensure each record has a temporary id for type compatibility
      medicalHistory: petData.medicalHistory ?
        petData.medicalHistory.map(record => ({
          ...record,
          id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Temporary ID that will be replaced by the backend
        })) :
        undefined
    };
    
    return apiClient.pets.update<Pet>(id, transformedData);
  }

  /**
   * Delete a pet
   */
  async deletePet(id: string): Promise<ApiResponse<Pet>> {
    return apiClient.pets.delete<Pet>(id);
  }

  /**
   * Get pets by owner ID
   */
  async getPetsByOwner(ownerId: string): Promise<ApiResponse<Pet[]>> {
    return apiClient.pets.select<Pet>({
      filters: { ownerId }
    });
  }
}

// Export a singleton instance of the service
export const petsApi = new PetsApiService();

// Also export the class for testing or custom instantiation
export default PetsApiService;
