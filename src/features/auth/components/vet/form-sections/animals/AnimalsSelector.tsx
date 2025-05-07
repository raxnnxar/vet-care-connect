
import React, { useState } from 'react';
import { Check, Dog, Cat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/atoms/button';
import { ANIMAL_TYPES } from '../../../../types/veterinarianTypes';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/ui/molecules/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';

interface AnimalsSelectorProps {
  selectedAnimals: string[];
  onChange: (animals: string[]) => void;
}

const AnimalsSelector: React.FC<AnimalsSelectorProps> = ({
  selectedAnimals = [],
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Asegurarnos que selectedAnimals sea siempre un array
  const safeSelectedAnimals = Array.isArray(selectedAnimals) ? selectedAnimals : [];

  const handleToggleAnimal = (animalValue: string) => {
    if (!animalValue) return;
    
    const isSelected = safeSelectedAnimals.includes(animalValue);
    let newValues: string[];
    
    if (isSelected) {
      newValues = safeSelectedAnimals.filter((val) => val !== animalValue);
    } else {
      newValues = [...safeSelectedAnimals, animalValue];
    }
    
    onChange(newValues);
    setSearchValue('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          type="button"
          className={cn(
            "w-full justify-start text-left font-normal",
            !safeSelectedAnimals.length && "text-muted-foreground"
          )}
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          <div className="flex items-center gap-1">
            <Dog className="h-4 w-4 text-gray-500" />
            <Cat className="h-4 w-4 text-gray-500" />
          </div>
          <span className="ml-2">
            {safeSelectedAnimals.length
              ? `${safeSelectedAnimals.length} especie${safeSelectedAnimals.length > 1 ? 's' : ''} seleccionada${safeSelectedAnimals.length > 1 ? 's' : ''}`
              : "Selecciona especies animales (opcional)"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white z-50" align="start">
        <Command>
          <CommandInput 
            placeholder="Buscar especie..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {ANIMAL_TYPES.map((animal) => {
              const isSelected = safeSelectedAnimals.includes(animal.value);
              
              return (
                <CommandItem
                  key={animal.value}
                  value={animal.value}
                  onSelect={() => handleToggleAnimal(animal.value)}
                >
                  <div 
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                  <span>{animal.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AnimalsSelector;
