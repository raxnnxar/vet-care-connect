
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { ANIMAL_TYPES } from '../../../../types/veterinarianTypes';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/atoms/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/ui/molecules/select';

interface AnimalsSelectorProps {
  selectedAnimals: string[];
  onChange: (animals: string[]) => void;
}

const AnimalsSelector: React.FC<AnimalsSelectorProps> = ({
  selectedAnimals = [],
  onChange
}) => {
  // Asegurar que selectedAnimals siempre sea un array
  const safeSelectedAnimals = Array.isArray(selectedAnimals) ? selectedAnimals : [];
  const [currentValue, setCurrentValue] = useState<string>("");

  // Manejar la adición de un nuevo animal
  const handleAddAnimal = () => {
    if (!currentValue || !currentValue.trim()) return;
    
    // Verificar si el animal ya está seleccionado
    if (safeSelectedAnimals.includes(currentValue)) {
      setCurrentValue("");
      return;
    }

    // Crear un nuevo array con el animal añadido
    const newValues = [...safeSelectedAnimals, currentValue];
    onChange(newValues);
    setCurrentValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="flex-grow">
          <Select
            value={currentValue}
            onValueChange={(value) => {
              setCurrentValue(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una especie" />
            </SelectTrigger>
            <SelectContent>
              {ANIMAL_TYPES.filter(animal => 
                !safeSelectedAnimals.includes(animal.value)
              ).map((animal) => (
                <SelectItem
                  key={animal.value}
                  value={animal.value}
                >
                  {animal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          onClick={handleAddAnimal}
          disabled={!currentValue || safeSelectedAnimals.includes(currentValue)}
          variant="outline"
          className={cn(
            "flex items-center gap-2"
          )}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Agregar</span>
        </Button>
      </div>

      {safeSelectedAnimals.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No has seleccionado ninguna especie todavía
        </p>
      )}
    </div>
  );
};

export default AnimalsSelector;
