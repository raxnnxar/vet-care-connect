export interface MedicalFormValues {
  surgeries: { type: string; date: string; }[];
  allergies: string;
  chronicConditions: string;
  medications: {
    name: string;
    dosage: string;
    frequency_hours: number;
    start_date: string;
    is_permanent: boolean;
    end_date: string;
  }[];
}

export interface OwnerMedication {
  id?: string;
  pet_id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  start_date: string;
  end_date: string | null;
  is_permanent: boolean;
  created_at?: string;
}

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

export interface PetBasicInfoProps {
  control: any;
  register: any;
  errors: any;
  selectedSpecies: string;
}
