
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { toast } from 'sonner';
import { Pet } from '../types';
import PetForm from './PetForm';
import PetList from '@/features/auth/components/PetList';
import PetDetailModal from './PetDetailModal';
import MedicalDialog from './medical/MedicalDialog';
import { usePets } from '../hooks';

interface PetManagementSectionProps {
  // These are now optional because they can be provided as direct props or through userPets
  pets?: Pet[];
  isLoading?: boolean;
  onPetAdded?: (pet: Pet) => void;
  
  // Optional properties specific to the OwnerProfileScreen usage
  userPets?: Pet[];
  handlePetClick?: (pet: Pet) => void;
  handlePetUpdate?: (petData: any) => Promise<Pet | null>;
  handlePetFormSubmit?: (petData: any) => Promise<Pet | null>;
  selectedPet?: Pet | null;
  setSelectedPet?: (pet: Pet | null) => void;
  editingPet?: Pet | null;
  setEditingPet?: (pet: Pet | null) => void;
  showPetForm?: boolean;
  setShowPetForm?: (show: boolean) => void;
}

const PetManagementSection: React.FC<PetManagementSectionProps> = ({
  pets = [],
  isLoading = false,
  onPetAdded = () => {},
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
  // Use local state if the props are not provided
  const [localShowPetForm, setLocalShowPetForm] = useState(false);
  const [localShowMedicalDialog, setLocalShowMedicalDialog] = useState(false);
  const [localSelectedPet, setLocalSelectedPet] = useState<Pet | null>(null);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);
  const [localEditingPet, setLocalEditingPet] = useState<Pet | null>(null);
  const { createPet, updatePet } = usePets();

  // Use the prop handlers if provided, otherwise use local handlers
  const actualShowPetForm = showPetForm !== undefined ? showPetForm : localShowPetForm;
  const actualSetShowPetForm = setShowPetForm || setLocalShowPetForm;
  const actualSelectedPet = selectedPet !== undefined ? selectedPet : localSelectedPet;
  const actualSetSelectedPet = setSelectedPet || setLocalSelectedPet;
  const actualEditingPet = editingPet !== undefined ? editingPet : localEditingPet;
  const actualSetEditingPet = setEditingPet || setLocalEditingPet;
  const actualPets = userPets || pets;

  const handleLocalPetSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      if (handlePetFormSubmit) {
        return await handlePetFormSubmit(petData);
      }
      
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
      actualSetShowPetForm(false);
      setLocalShowMedicalDialog(true);
      
      toast.success('Mascota agregada con éxito');
      return newPet as Pet;
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      toast.error('Error al agregar la mascota');
      return null;
    }
  };

  const handleLocalPetUpdate = async (petData: any): Promise<Pet | null> => {
    try {
      if (handlePetUpdate) {
        return await handlePetUpdate(petData);
      }
      
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

  const handleLocalPetClick = (pet: Pet) => {
    if (handlePetClick) {
      handlePetClick(pet);
    } else {
      actualSetSelectedPet(pet);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tus mascotas</h3>
      
      <PetList 
        pets={actualPets} 
        isLoading={isLoading} 
      />
      
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => {
          actualSetEditingPet(null);
          actualSetShowPetForm(true);
        }}
      >
        Añadir mascota
      </Button>

      {actualShowPetForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg transform transition-all animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {actualEditingPet ? 'Editar mascota' : 'Agregar mascota'}
              </h2>
              <PetForm
                mode={actualEditingPet ? 'edit' : 'create'}
                pet={actualEditingPet}
                onSubmit={handleLocalPetSubmit}
                isSubmitting={false}
                onCancel={() => {
                  actualSetShowPetForm(false);
                  actualSetEditingPet(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {lastCreatedPet && (
        <MedicalDialog
          pet={lastCreatedPet}
          open={localShowMedicalDialog}
          onClose={() => {
            setLocalShowMedicalDialog(false);
            setLastCreatedPet(null);
          }}
        />
      )}

      {actualSelectedPet && (
        <PetDetailModal
          pet={actualSelectedPet}
          isOpen={!!actualSelectedPet}
          onClose={() => actualSetSelectedPet(null)}
          onPetUpdate={handleLocalPetUpdate}
        />
      )}
    </div>
  );
};

export default PetManagementSection;
