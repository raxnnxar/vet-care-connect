
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
  prescribed_by_owner: boolean;
  created_at?: string;
}
