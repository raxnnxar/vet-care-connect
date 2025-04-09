
import { ApiResponse, QueryOptions } from '../../../core/api/apiClient';
import { Pet, CreatePetData, UpdatePetData } from '../types';

/**
 * Interface defining the contract for Pet API operations
 */
export interface IPetsApi {
  /**
   * Get all pets with optional filtering
   * @param options Query options for filtering, sorting, and pagination
   */
  getPets(options?: QueryOptions): Promise<ApiResponse<Pet[]>>;

  /**
   * Get a single pet by ID
   * @param id The pet's unique identifier
   */
  getPetById(id: string): Promise<ApiResponse<Pet>>;

  /**
   * Create a new pet
   * @param petData The data for creating a new pet
   */
  createPet(petData: CreatePetData): Promise<ApiResponse<Pet>>;

  /**
   * Update an existing pet
   * @param id The pet's unique identifier
   * @param petData The data to update on the pet
   */
  updatePet(id: string, petData: UpdatePetData): Promise<ApiResponse<Pet>>;

  /**
   * Delete a pet
   * @param id The pet's unique identifier
   */
  deletePet(id: string): Promise<ApiResponse<Pet>>;

  /**
   * Get pets belonging to a specific owner
   * @param ownerId The owner's unique identifier
   */
  getPetsByOwner(ownerId: string): Promise<ApiResponse<Pet[]>>;
}
