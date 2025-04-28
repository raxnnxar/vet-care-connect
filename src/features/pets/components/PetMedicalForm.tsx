
import React from 'react';
import { Syringe } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Pet } from '../types';
import MedicalDialog from './medical/MedicalDialog';

interface PetMedicalFormProps {
  pet: Pet;
  onComplete: () => void;
  onSkip: () => void;
}

const PetMedicalForm: React.FC<PetMedicalFormProps> = ({ pet, onComplete, onSkip }) => {
  const [showMedicalDialog, setShowMedicalDialog] = React.useState(true);

  const handleMedicalDialogClose = () => {
    setShowMedicalDialog(false);
    onComplete();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
        <Button 
          type="button" 
          onClick={() => setShowMedicalDialog(true)}
          className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white py-4 px-6 text-base font-medium flex items-center justify-center gap-2"
        >
          <Syringe className="h-4 w-4" />
          Agregar información médica
        </Button>
      </div>

      {showMedicalDialog && (
        <MedicalDialog
          pet={pet}
          open={showMedicalDialog}
          onClose={handleMedicalDialogClose}
        />
      )}
    </>
  );
};

export default PetMedicalForm;
