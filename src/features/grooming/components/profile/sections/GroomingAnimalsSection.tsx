
import React from 'react';
import { Badge } from '@/ui/atoms/badge';
import { Heart } from 'lucide-react';
import { EditableSection } from '@/features/vets/components/profile/EditableSection';
import { ANIMAL_LABELS } from '@/features/auth/types/groomingTypes';

interface GroomingAnimalsSectionProps {
  animals: string[];
  allAnimalTypes: string[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedAnimals: string[];
  toggleAnimal: (animal: string) => void;
}

const GroomingAnimalsSection: React.FC<GroomingAnimalsSectionProps> = ({
  animals,
  allAnimalTypes,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedAnimals,
  toggleAnimal
}) => {
  return (
    <EditableSection
      title="Animales que Acepto"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {isEditing ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Selecciona los tipos de animales que atiendes en tu estética:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {allAnimalTypes.map((animalType) => (
              <button
                key={animalType}
                onClick={() => toggleAnimal(animalType)}
                className={`p-3 rounded-lg border-2 transition-colors text-left ${
                  editedAnimals.includes(animalType)
                    ? 'border-[#79D0B8] bg-[#79D0B8]/10 text-[#79D0B8]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Heart 
                    size={16} 
                    className={editedAnimals.includes(animalType) ? 'fill-current' : ''} 
                  />
                  <span className="font-medium">
                    {ANIMAL_LABELS[animalType as keyof typeof ANIMAL_LABELS] || animalType}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {animals.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {animals.map((animal, index) => (
                <Badge key={index} variant="outline" className="bg-[#79D0B8]/10 text-[#79D0B8] border-[#79D0B8]">
                  <Heart size={12} className="mr-1 fill-current" />
                  {ANIMAL_LABELS[animal as keyof typeof ANIMAL_LABELS] || animal}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay animales especificados</p>
          )}
        </div>
      )}
    </EditableSection>
  );
};

export default GroomingAnimalsSection;
