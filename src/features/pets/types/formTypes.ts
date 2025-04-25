
import { Control, FieldErrors } from 'react-hook-form';

export interface PetFormValues {
  name: string;
  species: string;
  customSpecies?: string;
  age?: number;
  weight?: number;
  sex: string;
  temperament: string;
  additionalNotes: string;
}

export interface PetBasicInfoProps {
  control: Control<PetFormValues>;
  register: any;
  errors: FieldErrors<PetFormValues>;
  selectedSpecies: string;
}

export interface PetPhotoUploadProps {
  photoPreview: string | null;
  onPhotoSelect: (file: File) => void;
}
