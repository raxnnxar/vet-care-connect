import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { toast } from 'sonner';
import { Pet } from '@/features/pets/types';
import PetForm from '@/features/pets/components/PetForm';
import PetList from '@/features/auth/components/PetList';
import PetDetailModal from '@/features/pets/components/PetDetailModal';
import MedicalDialog from '@/features/pets/components/medical/MedicalDialog';
import { usePets } from '@/features/pets/hooks';

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
  const [showMedicalDialog, setShowMedicalDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const { createPet, updatePet } = usePets();

  const handlePetSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      if (!petData) {
        toast.error('Datos de mascota inválidos');
        return null;
      }
      
      const newPet = await createPet(petData);
      
      if (!newPet) {
        toast.error('Error al crear la mascota');
        return null;
      }
      
      setLastCreatedPet(newPet as Pet);
      onPetAdded(newPet as Pet);
      setShowPetForm(false);
      setShowMedicalDialog(true);
      
      toast.success('Mascota agregada con éxito');
      return newPet as Pet;
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      toast.error('Error al agregar la mascota');
      return null;
    }
  };

  const handlePetUpdate = async (petData: any): Promise<Pet | null> => {
    try {
      if (!petData || !petData.id) {
        toast.error('Datos de mascota inválidos');
        return null;
      }
      
      const updatedPet = await updatePet(petData.id, petData);
      
      if (!updatedPet) {
        toast.error('Error al actualizar la mascota');
        return null;
      }
      
      toast.success('Mascota actualizada con éxito');
      return updatedPet as Pet;
    } catch (error) {
      console.error('Error al actualizar la mascota:', error);
      toast.error('Error al actualizar la mascota');
      return null;
    }
  };

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tus mascotas</h3>
      
      <PetList 
        pets={pets} 
        isLoading={isLoading} 
      />
      
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
                onSubmit={handlePetSubmit}
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

      {lastCreatedPet && (
        <MedicalDialog
          pet={lastCreatedPet}
          open={showMedicalDialog}
          onClose={() => {
            setShowMedicalDialog(false);
            setLastCreatedPet(null);
          }}
        />
      )}

      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          isOpen={!!selectedPet}
          onClose={() => setSelectedPet(null)}
          onPetUpdate={handlePetUpdate}
        />
      )}
    </div>
  );
};

export default PetManagementSection;
