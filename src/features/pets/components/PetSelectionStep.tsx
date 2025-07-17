
import React from 'react';
import { Pet } from '@/features/pets/types';
import { usePets } from '@/features/pets/hooks';
import PetListItem from './PetListItem';
import { Button } from '@/ui/atoms/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/ui/atoms/skeleton';
import { PlusCircle } from 'lucide-react';

interface PetSelectionStepProps {
  selectedPet: Pet | null;
  onPetSelect: (pet: Pet) => void;
}

const PetSelectionStep: React.FC<PetSelectionStepProps> = ({
  selectedPet,
  onPetSelect
}) => {
  const { pets, isLoading } = usePets();
  const navigate = useNavigate();

  const handleAddNewPet = () => {
    navigate('/owner/pets/add');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 mb-4">Selecciona una mascota</h3>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!pets || pets.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 mb-4">No tienes mascotas registradas</h3>
        <div className="flex flex-col items-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4 text-center">
            Necesitas registrar una mascota para poder agendar una cita
          </p>
          <Button 
            onClick={handleAddNewPet}
            className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
          >
            <PlusCircle size={18} />
            Añadir mascota
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <h3 className="font-medium text-gray-700 mb-4">Selecciona una mascota</h3>
      <div className="space-y-3">
        {pets.map((pet) => (
          <div 
            key={pet.id}
            onClick={() => onPetSelect(pet)}
            className={`border rounded-lg overflow-hidden transition-all ${
              selectedPet?.id === pet.id 
                ? 'border-[#79D0B8] bg-[#e8f7f3]' 
                : 'border-gray-200'
            }`}
          >
            <PetListItem pet={pet} onClick={() => onPetSelect(pet)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetSelectionStep;
