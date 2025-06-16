
import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';

export interface PetFormValues {
  name: string;
  species: string;
  breed?: string;
  customSpecies?: string;
  age?: number;
  weight?: number;
  sex: string;
  temperament?: string;
  additionalNotes?: string;
}

export interface PetBasicInfoProps {
  control: Control<PetFormValues>;
  register: UseFormRegister<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
  selectedSpecies: string;
}

export interface PetPhotoUploadProps {
  photoPreview: string | null;
  onPhotoSelect: (file: File) => void;
}

export interface MedicalFormValues {
  vaccineDocument?: FileList;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  surgeries: Array<{
    type: string;
    date: string;
  }>;
  allergies: string;
  chronicConditions: string;
}
