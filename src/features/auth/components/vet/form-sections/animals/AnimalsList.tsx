
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
  // Si no hay animales seleccionados, no renderizar nada
  if (!selectedAnimals?.length) return null;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
      {selectedAnimals.map((animalValue) => {
        // Encontrar la etiqueta correspondiente al valor
        const animal = ANIMAL_TYPES.find(a => a.value === animalValue);
        
        return (
          <Badge 
            key={animalValue} 
            className="py-1 px-3 bg-[#FF8A65] hover:bg-[#FF7043] flex items-center justify-between"
          >
            <span className="truncate mr-1">
              {animal?.label || animalValue}
            </span>
            <button
              type="button"
              onClick={() => onRemove(animalValue)}
              className="ml-auto rounded-full hover:bg-[#FF7043] p-0.5 flex items-center justify-center"
              aria-label={`Eliminar ${animal?.label || animalValue}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}
    </div>
  );
};

export default AnimalsList;
