
import React, { useState } from 'react';
import { Pet } from '@/features/pets/types';
import PetForm from '@/features/pets/components/PetForm';
import AddPetButton from './AddPetButton';
import PetList from './PetList';
import { toast } from 'sonner';
import { usePets } from '@/features/pets/hooks';
import MedicalDialog from '@/features/pets/components/medical/MedicalDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Check } from 'lucide-react';

interface PetManagementSectionProps {
  pets: Pet[];
  isLoading: boolean;
  onPetAdded: (pet: Pet) => void;
}

const PetManagementSection: React.FC<PetManagementSectionProps> = ({
  pets,
  isLoading,
  onPetAdded,
}) => {
  const [showPetForm, setShowPetForm] = useState(false);
  const [isSubmittingPet, setIsSubmittingPet] = useState(false);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);
  const [showMedicalDialog, setShowMedicalDialog] = useState(false);
  const { createPet } = usePets();

  const handlePetSubmit = async (petData: any): Promise<Pet | null> => {
    setIsSubmittingPet(true);
    try {
      if (!petData) {
        toast.error('Datos de mascota inválidos');
        return null;
      }

      console.log('Submitting pet data to backend:', petData);
      
      // Ensure we're using the actual API to create the pet in the database
      const newPet = await createPet(petData);
      
      if (!newPet) {
        toast.error('Error al crear la mascota en la base de datos');
        return null;
      }
      
      console.log('Pet created successfully:', newPet);
      
      // Store the created pet to reference in the medical dialog
      const petObj = newPet as Pet;
      setLastCreatedPet(petObj);
      onPetAdded(petObj);
      setShowPetForm(false);
      
      toast.success('Mascota agregada con éxito');
      return petObj;
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      toast.error('Error al agregar la mascota');
      return null;
    } finally {
      setIsSubmittingPet(false);
    }
  };

  const handleShowMedicalForm = () => {
    console.log("Opening medical dialog for pet:", lastCreatedPet);
    setShowMedicalDialog(true);
  };

  const handleCloseMedicalDialog = () => {
    console.log("Closing medical dialog");
    setShowMedicalDialog(false);
    setLastCreatedPet(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tus mascotas</h3>
      
      <PetList 
        pets={pets} 
        isLoading={isLoading} 
      />
      
      <AddPetButton
        hasPets={pets.length > 0}
        onClick={() => setShowPetForm(true)}
      />

      {showPetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Agregar mascota</h2>
              <PetForm
                mode="create"
                onSubmit={handlePetSubmit}
                isSubmitting={isSubmittingPet}
                onCancel={() => setShowPetForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success dialog after adding a pet */}
      <Dialog open={!!lastCreatedPet && !showMedicalDialog} onOpenChange={(open) => {
        if (!open) {
          setLastCreatedPet(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="text-2xl font-semibold">
                ¡Mascota agregada con éxito!
              </DialogTitle>
              <DialogDescription className="mt-2 text-center">
                ¿Deseas agregar información médica para tu mascota ahora?
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-3 sm:gap-2 pt-4">
            <Button 
              variant="default" 
              className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3]"
              onClick={handleShowMedicalForm}
            >
              Agregar información médica
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setLastCreatedPet(null)}
            >
              Ahora no
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medical Dialog */}
      {lastCreatedPet && (
        <MedicalDialog
          pet={lastCreatedPet}
          open={showMedicalDialog}
          onClose={handleCloseMedicalDialog}
        />
      )}
    </div>
  );
};

export default PetManagementSection;
