
import React, { useState } from 'react';
import { Pet, PetMedicalHistory } from '../types';
import PetForm from './PetForm';
import PetList from '@/features/auth/components/PetList';
import PetMedicalInfoForm from './medical/PetMedicalInfoForm';
import { toast } from 'sonner';
import { usePets } from '../hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/molecules/dialog';

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
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);
  const { createPet, updatePet } = usePets();

  const handlePetSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      if (!petData) {
        toast.error('Datos de mascota inválidos');
        return null;
      }

      console.log('Submitting pet data:', petData);
      
      const newPet = await createPet(petData);
      
      if (!newPet) {
        toast.error('Error al crear la mascota');
        return null;
      }
      
      console.log('Pet created successfully:', newPet);
      
      setLastCreatedPet(newPet as Pet);
      onPetAdded(newPet as Pet);
      setShowPetForm(false);
      setShowMedicalForm(true);
      
      toast.success('Mascota agregada con éxito');
      return newPet as Pet;
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      toast.error('Error al agregar la mascota');
      return null;
    }
  };

  const handleMedicalInfoSubmit = async (medicalInfo: PetMedicalHistory) => {
    if (!lastCreatedPet) {
      toast.error('No se encontró la mascota');
      return;
    }

    try {
      // We'll use updatePet to update the pet with the medical history
      await updatePet(lastCreatedPet.id, {
        medicalHistory: medicalInfo
      });
      setShowMedicalForm(false);
      setLastCreatedPet(null);
      toast.success('Información médica guardada exitosamente');
    } catch (error) {
      console.error('Error saving medical information:', error);
      toast.error('Error al guardar la información médica');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tus mascotas</h3>
      
      <PetList 
        pets={pets} 
        isLoading={isLoading} 
      />
      
      <button
        onClick={() => setShowPetForm(true)}
        className="w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Agregar mascota
      </button>

      {showPetForm && (
        <Dialog open={showPetForm} onOpenChange={setShowPetForm}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar mascota</DialogTitle>
            </DialogHeader>
            <PetForm
              mode="create"
              onSubmit={handlePetSubmit}
              isSubmitting={false}
              onCancel={() => setShowPetForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showMedicalForm} onOpenChange={setShowMedicalForm}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Información médica para {lastCreatedPet?.name}</DialogTitle>
            <DialogDescription>
              Agregue información médica importante para su mascota
            </DialogDescription>
          </DialogHeader>
          {lastCreatedPet && (
            <PetMedicalInfoForm
              petId={lastCreatedPet.id}
              onSave={handleMedicalInfoSubmit}
              onCancel={() => {
                setShowMedicalForm(false);
                setLastCreatedPet(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetManagementSection;
