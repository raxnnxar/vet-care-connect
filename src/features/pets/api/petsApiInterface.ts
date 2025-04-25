
import { Pet, CreatePetData, UpdatePetData, PetFilters, PetMedicalHistory } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

export interface IPetsApi {
  /**
   * Get all pets with optional filtering
   */
  getPets(options?: QueryOptions & { filters?: PetFilters }): Promise<{
    data: Pet[] | null;
    error: Error | null;
  }>;
  
  /**
   * Get a single pet by ID
   */
  getPetById(id: string): Promise<{
    data: Pet | null;
    error: Error | null;
  }>;
  
  /**
   * Create a new pet
   */
  createPet(petData: CreatePetData): Promise<{
    data: Pet | null;
    error: Error | null;
  }>;
  
  /**
   * Update an existing pet
   */
  updatePet(id: string, petData: UpdatePetData): Promise<{
    data: Pet | null;
    error: Error | null;
  }>;
  
  /**
   * Delete a pet
   */
  deletePet(id: string): Promise<{
    data: any | null;
    error: Error | null;
  }>;
  
  /**
   * Get pets by owner ID
   */
  getPetsByOwner(ownerId: string): Promise<{
    data: Pet[] | null;
    error: Error | null;
  }>;

  /**
   * Upload a pet profile picture
   */
  uploadPetProfilePicture(petId: string, file: File): Promise<{
    data: { publicUrl: string } | null;
    error: Error | null;
  }>;
  
  /**
   * Upload a vaccine document for a pet
   */
  uploadVaccineDocument(petId: string, file: File): Promise<{
    data: { publicUrl: string } | null;
    error: Error | null;
  }>;
  
  /**
   * Create pet medical history
   */
  createPetMedicalHistory(petId: string, medicalHistoryData: PetMedicalHistory): Promise<{
    data: any | null;
    error: Error | null;
  }>;
}
