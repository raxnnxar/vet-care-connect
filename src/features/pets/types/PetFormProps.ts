
import { Pet } from './index';

export interface PetFormProps {
  mode?: 'create' | 'edit' | 'list';
  onSubmit?: (petData: any) => Promise<Pet | null>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  petId?: string;
}
