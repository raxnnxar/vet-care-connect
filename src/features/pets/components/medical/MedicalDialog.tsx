
import React, { useState } from 'react';
import { Pet } from '../../types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Syringe } from 'lucide-react';
import { toast } from 'sonner';
import VaccineDocumentUpload from './VaccineDocumentUpload';
import MedicalDialogHeader from './MedicalDialogHeader';
import MedicalInfoViewer from './MedicalInfoViewer';
import DigitalVaccinationSection from './DigitalVaccinationSection';
import OnboardingAllergiesSection from './OnboardingAllergiesSection';
import OnboardingChronicConditionsSection from './OnboardingChronicConditionsSection';
import OnboardingSurgeriesSection from './OnboardingSurgeriesSection';
import OnboardingMedicationsSection from './OnboardingMedicationsSection';

interface MedicalDialogProps {
  pet: Pet;
  onClose: () => void;
  open: boolean;
  mode?: 'edit' | 'view';
}

const MedicalDialog: React.FC<MedicalDialogProps> = ({ pet, onClose, open, mode = 'edit' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveComplete = () => {
    toast.success('Información médica guardada exitosamente');
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <MedicalDialogHeader 
            petName={pet.name}
          />
        </DialogHeader>

        {mode === 'view' ? (
          <MedicalInfoViewer pet={pet} />
        ) : (
          <div className="space-y-6">
            {/* Vaccine Document Upload Section */}
            <div className="space-y-3">
              <VaccineDocumentUpload 
                petId={pet.id} 
                petOwnerId={pet.owner_id}
              />
              <p className="text-sm text-gray-600">
                Si tienes una foto o PDF de tu cartilla física, súbelo aquí como respaldo. No es obligatorio.
              </p>
            </div>
            
            {/* Digital Vaccination Section */}
            <DigitalVaccinationSection petId={pet.id} />
            
            {/* New sections using individual tables */}
            <OnboardingAllergiesSection petId={pet.id} />
            
            <OnboardingChronicConditionsSection petId={pet.id} />
            
            <OnboardingSurgeriesSection petId={pet.id} />

            <OnboardingMedicationsSection petId={pet.id} />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="button" 
                className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
                onClick={handleSaveComplete}
              >
                <Syringe className="h-4 w-4 mr-2" />
                Guardar información médica
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={handleSkip}
                className="w-full sm:w-auto"
              >
                Omitir por ahora
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicalDialog;
