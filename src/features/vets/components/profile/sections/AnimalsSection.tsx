
import React from 'react';
import { Dog, Cat } from 'lucide-react';
import { AnimalType } from '@/features/auth/types/veterinarianTypes';
import { EditableSection } from '../EditableSection';

interface AnimalsSectionProps {
  animals: string[];
  allAnimalTypes: AnimalType[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedAnimals: string[];
  toggleAnimal: (animalType: string) => void;
}

const AnimalsSection: React.FC<AnimalsSectionProps> = ({
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
      title="Animales que atiende"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {!isEditing ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
          {animals && animals.length > 0 ? (
            allAnimalTypes.filter(animal => 
              animals?.includes(animal.value)
            ).map((animal) => (
              <div key={animal.value} className="flex flex-col items-center p-3 bg-[#e8f7f3] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1">
                  {animal.value === 'dog' ? (
                    <Dog className="w-6 h-6 text-[#4DA6A8]" />
                  ) : animal.value === 'cat' ? (
                    <Cat className="w-6 h-6 text-[#4DA6A8]" />
                  ) : (
                    <span className="w-6 h-6 flex items-center justify-center text-[#4DA6A8] text-xl">•</span>
                  )}
                </div>
                <span className="font-medium text-center text-sm">{animal.label}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-4 col-span-full">
              No hay tipos de animales registrados
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
          {allAnimalTypes.map((animal) => (
            <div 
              key={animal.value}
              className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${
                editedAnimals.includes(animal.value) 
                  ? 'bg-[#4DA6A8] text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => toggleAnimal(animal.value)}
            >
              <div className={`w-8 h-8 rounded-full ${editedAnimals.includes(animal.value) ? 'bg-white/20' : 'bg-white'} flex items-center justify-center mb-1`}>
                {animal.value === 'dog' ? (
                  <Dog className="w-5 h-5" />
                ) : animal.value === 'cat' ? (
                  <Cat className="w-5 h-5" />
                ) : (
                  <span className="w-5 h-5 flex items-center justify-center text-lg">•</span>
                )}
              </div>
              <span className="font-medium text-center text-xs">{animal.label}</span>
            </div>
          ))}
        </div>
      )}
    </EditableSection>
  );
};

export default AnimalsSection;
