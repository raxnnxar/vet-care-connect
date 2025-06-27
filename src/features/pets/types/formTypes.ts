import { Control, FieldErrors } from 'react-hook-form';

// Form values for pet creation/editing
export interface PetFormValues {
  name: string;
  species: string;
  breed: string;
  customSpecies: string;
  age?: number;
  weight?: number;
  sex: string;
  temperament: string;
  additionalNotes: string;
}

// Props for PetBasicInfo component
export interface PetBasicInfoProps {
  control: Control<PetFormValues>;
  register: any;
  errors: FieldErrors<PetFormValues>;
  selectedSpecies: string;
}

// Updated MedicalFormValues for the new structure
export interface MedicalFormValues {
  // Keep old fields for backward compatibility but mark as obsolete
  allergies?: string;
  chronicConditions?: string;
  surgeries?: Array<{
    type: string;
    date: string;
  }>;
  
  // New medications field for owner medications
  medications?: Array<{
    name: string;
    dosage: string;
    frequency_hours: number;
    start_date: string;
    category: 'cronico' | 'suplemento';
  }>;
}

// New types for the specialized tables
export interface PetAllergy {
  id: string;
  pet_id: string;
  allergen: string;
  notes?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export interface PetChronicCondition {
  id: string;
  pet_id: string;
  condition: string;
  notes?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export interface PetSurgery {
  id: string;
  pet_id: string;
  procedure: string;
  surgery_date?: string;
  notes?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export interface OwnerMedication {
  id: string;
  pet_id: string;
  medication: string;
  dosage?: string;
  frequency_hours?: number;
  start_date?: string;
  category: 'cronico' | 'suplemento';
  instructions?: string;
  created_at?: string;
}
