
import React from 'react';
import { Pet } from '@/features/pets/types';
import PetMedicalForm from '../PetMedicalForm';

interface FormStepsProps {
  step: 'basic' | 'medical';
  createdPet: Pet | null;
  onComplete: () => void;
}

const FormSteps: React.FC<FormStepsProps> = ({ step, createdPet, onComplete }) => {
  if (step === 'medical' && createdPet) {
    return (
      <PetMedicalForm
        pet={createdPet}
        onComplete={onComplete}
        onSkip={onComplete}
      />
    );
  }
  
  return null;
};

export default FormSteps;
