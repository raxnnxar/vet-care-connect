/**
 * Pets API service
 * 
 * Provides methods for interacting with pet data in the database
 */
import apiClient, { ApiResponse, QueryOptions } from '../../../core/api/apiClient';
import { Pet, CreatePetData, UpdatePetData } from '../types';

/**
 * Get all pets with optional filtering
 */
export const getPets = async (options?: QueryOptions): Promise<ApiResponse<Pet[]>> => {
  return apiClient.pets.select<Pet>(options);
};

/**
 * Get a single pet by ID
 */
export const getPetById = async (id: string): Promise<ApiResponse<Pet>> => {
  return apiClient.pets.getById<Pet>(id);
};

/**
 * Create a new pet
 */
export const createPet = async (petData: CreatePetData): Promise<ApiResponse<Pet>> => {
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
};

/**
 * Update an existing pet
 */
export const updatePet = async (id: string, petData: UpdatePetData): Promise<ApiResponse<Pet>> => {
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
};

/**
 * Delete a pet
 */
export const deletePet = async (id: string): Promise<ApiResponse<Pet>> => {
  return apiClient.pets.delete<Pet>(id);
};

/**
 * Get pets by owner ID
 */
export const getPetsByOwner = async (ownerId: string): Promise<ApiResponse<Pet[]>> => {
  return apiClient.pets.select<Pet>({
    filters: { ownerId }
  });
};
