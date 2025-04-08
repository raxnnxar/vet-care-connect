
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
  return apiClient.pets.insert<Pet>(petData);
};

/**
 * Update an existing pet
 */
export const updatePet = async (id: string, petData: UpdatePetData): Promise<ApiResponse<Pet>> => {
  return apiClient.pets.update<Pet>(id, petData);
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
