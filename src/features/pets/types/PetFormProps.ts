
import { Pet } from './index';

export interface PetFormProps {
  mode: 'create' | 'edit';
  onSubmit: (petData: any) => Promise<Pet | null>;
  isSubmitting: boolean;
  onCancel?: () => void;
  pet?: Pet | null;
}
