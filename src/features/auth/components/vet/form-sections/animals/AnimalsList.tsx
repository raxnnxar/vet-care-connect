
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
import { ANIMAL_TYPES } from '../../../../types/veterinarianTypes';

interface AnimalsListProps {
  selectedAnimals: string[];
  onRemove: (value: string) => void;
}

const AnimalsList: React.FC<AnimalsListProps> = ({ 
  selectedAnimals, 
  onRemove 
}) => {
  // Si no hay animales seleccionados o no es un array, no renderizar nada
  if (!Array.isArray(selectedAnimals) || !selectedAnimals.length) return null;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
      {selectedAnimals.map((animalValue) => {
        try {
          // Encontrar la etiqueta correspondiente al valor
          const animal = ANIMAL_TYPES.find(a => a.value === animalValue);
          
          return (
            <Badge 
              key={animalValue} 
              className="py-1 px-3 bg-[#79D0B8] hover:bg-[#5FBFB3] flex items-center justify-between"
            >
              <span className="truncate mr-1">
                {animal?.label || animalValue}
              </span>
              <button
                type="button"
                onClick={() => onRemove(animalValue)}
                className="ml-auto rounded-full hover:bg-[#5FBFB3] p-0.5 flex items-center justify-center"
                aria-label={`Eliminar ${animal?.label || animalValue}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        } catch (e) {
          console.error(`Error rendering animal tag: ${animalValue}`, e);
          return null;
        }
      })}
    </div>
  );
};

export default AnimalsList;
