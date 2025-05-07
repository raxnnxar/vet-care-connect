
import React from 'react';
import { Control, FieldErrors, useController } from 'react-hook-form';
import { VeterinarianProfile, ANIMAL_TYPES } from '../../../../types/veterinarianTypes';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import { Check, X, Dog, Cat } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';
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
import { cn } from '@/lib/utils';

interface AnimalsSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const AnimalsSection: React.FC<AnimalsSectionProps> = ({
  control,
  errors,
}) => {
  const [animalSearchValue, setAnimalSearchValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const { 
    field: { value, onChange }
  } = useController({
    name: 'animals_treated',
    control,
    defaultValue: [] // Aseguramos que siempre exista un valor predeterminado como array vacío
  });
  
  // Garantizamos que value siempre sea un array válido
  const animalsValue: string[] = Array.isArray(value) ? value : [];

  // Manejador para agregar o eliminar una especie animal
  const handleToggleAnimal = (animalValue: string) => {
    const isSelected = animalsValue.includes(animalValue);
    
    let newValues: string[];
    if (isSelected) {
      newValues = animalsValue.filter((val) => val !== animalValue);
    } else {
      newValues = [...animalsValue, animalValue];
    }
    
    onChange(newValues);
    setAnimalSearchValue('');
  };
  
  // Manejador para eliminar una especie animal desde una etiqueta
  const handleRemoveAnimal = (animalValue: string) => {
    const newValues = animalsValue.filter((val) => val !== animalValue);
    onChange(newValues);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Selecciona los tipos de especies que atiendes en tu práctica
      </p>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline"
            type="button"
            className={cn(
              "w-full justify-start text-left font-normal",
              !animalsValue.length && "text-muted-foreground"
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
              {animalsValue.length
                ? `${animalsValue.length} tipo${animalsValue.length > 1 ? 's' : ''} de especie${animalsValue.length > 1 ? 's' : ''} seleccionado${animalsValue.length > 1 ? 's' : ''}`
                : "Selecciona los tipos de especies (opcional)"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white z-50" align="start">
          <Command>
            <CommandInput 
              placeholder="Buscar especie..." 
              value={animalSearchValue}
              onValueChange={setAnimalSearchValue}
            />
            <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {ANIMAL_TYPES.map((animal) => {
                const isSelected = animalsValue.includes(animal.value);
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

      {animalsValue.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {animalsValue.map((animalValue) => {
            const animal = ANIMAL_TYPES.find(a => a.value === animalValue);
            return (
              <Badge key={animalValue} className="py-1 px-3 bg-[#FF8A65] hover:bg-[#FF7043]">
                {animal?.label || animalValue}
                <button
                  type="button"
                  onClick={() => handleRemoveAnimal(animalValue)}
                  className="ml-2 rounded-full hover:bg-[#FF7043]"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar</span>
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AnimalsSection;
