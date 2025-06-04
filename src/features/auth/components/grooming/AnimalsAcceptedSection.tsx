
import React from 'react';
import { Control, FieldErrors, useController } from 'react-hook-form';
import { Checkbox } from '@/ui/atoms/checkbox';
import { ANIMAL_TYPES, ANIMAL_LABELS, AnimalType } from '../../types/groomingTypes';
import { GroomingProfile } from '../../types/groomingTypes';

interface AnimalsAcceptedSectionProps {
  control: Control<GroomingProfile>;
  errors: FieldErrors<GroomingProfile>;
}

const AnimalsAcceptedSection: React.FC<AnimalsAcceptedSectionProps> = ({
  control,
  errors,
}) => {
  const { field } = useController({
    name: 'animals_accepted',
    control,
    defaultValue: [ANIMAL_TYPES.DOG],
  });

  const handleAnimalToggle = (animalType: AnimalType) => {
    const currentAnimals = field.value || [];
    const updatedAnimals = currentAnimals.includes(animalType)
      ? currentAnimals.filter(animal => animal !== animalType)
      : [...currentAnimals, animalType];
    
    field.onChange(updatedAnimals);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Animales que aceptas
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Selecciona los tipos de animales que atiendes en tu negocio
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.values(ANIMAL_TYPES).map((animalType) => (
          <label
            key={animalType}
            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Checkbox
              checked={field.value?.includes(animalType) || false}
              onCheckedChange={() => handleAnimalToggle(animalType)}
            />
            <span className="text-sm font-medium text-gray-700">
              {ANIMAL_LABELS[animalType]}
            </span>
          </label>
        ))}
      </div>

      {errors.animals_accepted && (
        <p className="text-sm text-red-600">{errors.animals_accepted.message}</p>
      )}
    </div>
  );
};

export default AnimalsAcceptedSection;
