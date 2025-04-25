
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { toast } from 'sonner';
import { Pet } from '../types';
import PetForm from './PetForm';
import PetList from '@/features/auth/components/PetList';
import PetDetailModal from './PetDetailModal';
import MedicalForm from './medical/MedicalForm';
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
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handlePetSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      if (!petData) {
        toast.error('Datos de mascota inválidos');
        return null;
      }

      // Remove any potential medical history data from initial pet creation
      const { medicalHistory, ...petDetails } = petData;
      
      console.log('Submitting pet data:', petDetails);
      
      const newPet = await createPet(petDetails);
      
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

  const handleMedicalFormSuccess = () => {
    setShowMedicalForm(false);
    setLastCreatedPet(null);
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
        <Dialog open={showPetForm} onOpenChange={setShowPetForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPet ? 'Editar mascota' : 'Agregar mascota'}</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      )}

      <Dialog 
        open={showMedicalForm} 
        onOpenChange={(open) => {
          if (!open) {
            setShowMedicalForm(false);
            setLastCreatedPet(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Información médica para {lastCreatedPet?.name}</DialogTitle>
            <DialogDescription>
              Agregue información médica importante para su mascota
            </DialogDescription>
          </DialogHeader>
          {lastCreatedPet && (
            <MedicalForm
              pet={lastCreatedPet}
              onClose={() => {
                setShowMedicalForm(false);
                setLastCreatedPet(null);
              }}
              onSuccess={handleMedicalFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          isOpen={!!selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </div>
  );
};

export default PetManagementSection;
