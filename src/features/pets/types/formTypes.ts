
export interface MedicalFormValues {
  // Campos obsoletos mantenidos solo para compatibilidad temporal
  allergies?: string;
  chronicConditions?: string;
  surgeries?: Array<{
    type: string;
    date: string;
  }>;
  
  // Nota: Estos campos ya no se usan en el flujo actual
  // La información médica ahora se guarda en:
  // - pet_allergies
  // - pet_chronic_conditions  
  // - pet_surgeries
  // - owner_medications
}

// Nuevos tipos para las tablas especializadas
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
