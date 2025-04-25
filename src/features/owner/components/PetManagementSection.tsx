
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { toast } from 'sonner';
import { Pet } from '@/features/pets/types';
import PetForm from '@/features/pets/components/PetForm';
import PetListItem from '@/features/pets/components/PetListItem';
import PetDetailModal from '@/features/pets/components/PetDetailModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/molecules/dialog';

interface PetManagementSectionProps {
  userPets: Pet[];
  handlePetClick: (pet: Pet) => void;
  handlePetUpdate: (petData: any) => Promise<Pet | null>;
  handlePetFormSubmit: (petData: any) => Promise<Pet | null>;
  selectedPet: Pet | null;
  setSelectedPet: (pet: Pet | null) => void;
  editingPet: Pet | null;
  setEditingPet: (pet: Pet | null) => void;
  showPetForm: boolean;
  setShowPetForm: (show: boolean) => void;
}

const PetManagementSection: React.FC<PetManagementSectionProps> = ({
  userPets,
  handlePetClick,
  handlePetUpdate,
  handlePetFormSubmit,
  selectedPet,
  setSelectedPet,
  editingPet,
  setEditingPet,
  showPetForm,
  setShowPetForm,
}) => {
  const [showMedicalInfoDialog, setShowMedicalInfoDialog] = useState(false);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);

  const handleFormSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      const result = await handlePetFormSubmit(petData);
      
      if (result) {
        // Only show the dialog for new pets, not for edits
        if (!editingPet) {
          setLastCreatedPet(result);
          setShowMedicalInfoDialog(true);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting pet form:', error);
      return null;
    }
  };

  const handleGoToMedicalInfo = () => {
    setShowMedicalInfoDialog(false);
    if (lastCreatedPet) {
      // In a real implementation, this would navigate to the medical screen
      // or show the medical form for the pet
      setEditingPet(lastCreatedPet);
      setShowPetForm(true); // This would ideally navigate to a medical-specific form instead
      setLastCreatedPet(null);
    }
  };

  const handleSkipMedicalInfo = () => {
    setShowMedicalInfoDialog(false);
    setLastCreatedPet(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-medium mb-4">Mis Mascotas</h3>
      
      {userPets.length > 0 ? (
        <div className="grid gap-4">
          {userPets.map(pet => (
            <PetListItem 
              key={pet.id} 
              pet={pet}
              onClick={handlePetClick}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tienes mascotas registradas</p>
      )}

      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => {
          setEditingPet(null);
          setShowPetForm(true);
        }}
      >
        Añadir mascota
      </Button>

      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          isOpen={!!selectedPet}
          onClose={() => setSelectedPet(null)}
          onPetUpdate={handlePetUpdate}
        />
      )}

      {showPetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingPet ? 'Editar mascota' : 'Agregar mascota'}
              </h2>
              <PetForm
                mode={editingPet ? 'edit' : 'create'}
                pet={editingPet}
                onSubmit={handleFormSubmit}
                isSubmitting={false}
                onCancel={() => {
                  setShowPetForm(false);
                  setEditingPet(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <Dialog open={showMedicalInfoDialog} onOpenChange={setShowMedicalInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¡Mascota agregada con éxito!</DialogTitle>
            <DialogDescription>
              ¿Deseas agregar información médica para tu mascota ahora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button 
              variant="default"
              className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3]"
              onClick={handleGoToMedicalInfo}
            >
              Agregar información médica
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleSkipMedicalInfo}
            >
              Omitir por ahora
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetManagementSection;
