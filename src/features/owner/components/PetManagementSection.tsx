
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { toast } from 'sonner';
import { Pet } from '@/features/pets/types';
import PetForm from '@/features/pets/components/PetForm';
import MedicalDialog from '@/features/pets/components/medical/MedicalDialog';
import { usePets } from '@/features/pets/hooks';

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
  const navigate = useNavigate();
  // Use local state if the props are not provided
  const [localShowPetForm, setLocalShowPetForm] = useState(false);
  const [localShowMedicalDialog, setLocalShowMedicalDialog] = useState(false);
  const [lastCreatedPet, setLastCreatedPet] = useState<Pet | null>(null);
  const [localEditingPet, setLocalEditingPet] = useState<Pet | null>(null);
  const { createPet, updatePet } = usePets();

  // Use the prop handlers if provided, otherwise use local handlers
  const actualShowPetForm = showPetForm !== undefined ? showPetForm : localShowPetForm;
  const actualSetShowPetForm = setShowPetForm || setLocalShowPetForm;
  const actualEditingPet = editingPet !== undefined ? editingPet : localEditingPet;
  const actualSetEditingPet = setEditingPet || setLocalEditingPet;
  const actualPets = userPets || pets;

  const handleLocalPetSubmit = async (petData: any): Promise<Pet | null> => {
    try {
      if (handlePetFormSubmit) {
        const result = await handlePetFormSubmit(petData);
        if (result) {
          setLastCreatedPet(result);
          setLocalShowMedicalDialog(true);
        }
        return result;
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

  const handleLocalPetClick = (pet: Pet) => {
    if (handlePetClick) {
      handlePetClick(pet);
    } else {
      // Navigate to pet detail screen using the correct route
      navigate(`/pets/${pet.id}`);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Tus mascotas</h3>
      
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white/30 backdrop-blur-sm border border-white/30 p-4 rounded-lg animate-pulse flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-white/30"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-white/30 rounded"></div>
                  <div className="h-3 w-16 bg-white/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : !actualPets.length ? (
          <div className="text-center py-6 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-gray-600 text-sm">No tienes mascotas registradas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actualPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white/90 p-4 rounded-lg shadow-sm flex items-center gap-3 cursor-pointer hover:bg-white transition-colors"
                onClick={() => handleLocalPetClick(pet)}
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary font-semibold overflow-hidden">
                  {pet.profile_picture_url ? (
                    <img 
                      src={pet.profile_picture_url} 
                      alt={pet.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    pet.name ? pet.name.substring(0, 2).toUpperCase() : 'P'
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{pet.name}</h4>
                  <p className="text-sm text-gray-500">
                    {pet.species}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
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
    </div>
  );
};

export default PetManagementSection;
