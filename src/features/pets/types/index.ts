
/**
 * Core pet entity type
 */
export interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  weight?: number; // in kg
  temperament?: string;
  date_of_birth?: string; // ISO date string
  additional_notes?: string;
  owner_id: string;
  profile_picture_url?: string;
  created_at: string;
}

/**
 * Data required to create a new pet
 */
export interface CreatePetData {
  name: string;
  species: string;
  breed?: string;
  sex?: string;
  weight?: number;
  temperament?: string;
  date_of_birth?: string;
  additional_notes?: string;
  owner_id: string;
  medicalHistory?: PetMedicalHistory;
}

/**
 * Data that can be updated on an existing pet
 */
export interface UpdatePetData {
  name?: string;
  species?: string;
  breed?: string;
  sex?: string;
  weight?: number;
  temperament?: string;
  date_of_birth?: string;
  additional_notes?: string;
  profile_picture_url?: string;
}

/**
 * Medical history for a pet
 */
export interface PetMedicalHistory {
  allergies?: string;
  chronic_conditions?: string;
  vaccines_document_url?: string;
  current_medications?: Medication[];
  previous_surgeries?: Surgery[];
}

/**
 * Medication information
 */
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

/**
 * Surgery information
 */
export interface Surgery {
  type: string;
  date: string;
}

/**
 * Filter options for pet queries
 */
export interface PetFilters {
  owner_id?: string;
  species?: string;
}
