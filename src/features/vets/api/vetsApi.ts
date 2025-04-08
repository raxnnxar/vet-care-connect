
/**
 * Veterinarians API service
 * 
 * Provides methods for interacting with veterinarian data in the database
 */
import apiClient, { ApiResponse, QueryOptions } from '../../../core/api/apiClient';
import { Veterinarian, VetFilters } from '../types';

/**
 * Get all veterinarians with optional filtering
 */
export const getVeterinarians = async (options?: QueryOptions): Promise<ApiResponse<Veterinarian[]>> => {
  return apiClient.vets.select<Veterinarian>(options);
};

/**
 * Get a single veterinarian by ID
 */
export const getVeterinarianById = async (id: string): Promise<ApiResponse<Veterinarian>> => {
  return apiClient.vets.getById<Veterinarian>(id);
};

/**
 * Search for veterinarians based on various criteria
 */
export const searchVeterinarians = async (filters: VetFilters): Promise<ApiResponse<Veterinarian[]>> => {
  return apiClient.vets.select<Veterinarian>({
    filters: filters as Record<string, any>
  });
};

/**
 * Get top-rated veterinarians (example of a specialized query)
 */
export const getTopRatedVets = async (limit: number = 5): Promise<ApiResponse<Veterinarian[]>> => {
  return apiClient.vets.select<Veterinarian>({
    limit,
    orderBy: 'rating',
    orderDirection: 'desc'
  });
};
