
import React from 'react';
import { useController } from 'react-hook-form';
import { Control, FieldErrors } from 'react-hook-form';
import { X } from 'lucide-react';
import { VeterinarianProfile, ANIMAL_TYPES } from '../../../../types/veterinarianTypes';
import { Form, FormItem, FormLabel, FormControl, FormDescription } from '@/ui/molecules/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/molecules/select';
import { Badge } from '@/ui/atoms/badge';
import AnimalsList from './AnimalsList';

interface AnimalsSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const AnimalsSection = ({ control, errors }: AnimalsSectionProps) => {
  const {
    field: { value, onChange },
  } = useController({
    name: 'animals_treated',
    control,
    defaultValue: [] as string[],
  });

  const [selectedAnimal, setSelectedAnimal] = React.useState<string>('');

  // Asegurar que value siempre sea un array
  const safeValue = Array.isArray(value) ? value : [];

  const handleAddAnimal = () => {
    if (
      selectedAnimal && 
      !safeValue.includes(selectedAnimal)
    ) {
      onChange([...safeValue, selectedAnimal]);
      setSelectedAnimal('');
    }
  };

  const handleRemoveAnimal = (animalToRemove: string) => {
    onChange(safeValue.filter((animal) => animal !== animalToRemove));
  };

  // Filtrar opciones que ya han sido seleccionadas
  const availableOptions = ANIMAL_TYPES.filter((animal) => !safeValue.includes(animal.value));

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Especies que atiendes</FormLabel>
        <FormDescription className="mt-1 mb-4">
          Selecciona las especies de animales a los que brindas atención médica.
        </FormDescription>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una especie" />
            </SelectTrigger>
            <SelectContent>
              {availableOptions.length > 0 ? (
                availableOptions.map((animal) => (
                  <SelectItem key={animal.value} value={animal.value}>
                    {animal.label}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500">
                  Todos los tipos de animales ya han sido seleccionados
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <button
          type="button"
          onClick={handleAddAnimal}
          disabled={!selectedAnimal}
          className="px-4 py-2 bg-[#79D0B8] text-white rounded-md disabled:opacity-50 hover:bg-[#5FBFB3] transition-colors"
        >
          Agregar
        </button>
      </div>

      {/* Mostrar animales seleccionados */}
      {safeValue.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {safeValue.map((animalValue) => {
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
                  onClick={() => handleRemoveAnimal(animalValue)}
                  className="ml-auto rounded-full hover:bg-[#FF7043] p-0.5 flex items-center justify-center"
                  aria-label={`Eliminar ${animal?.label || animalValue}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 p-4 bg-gray-50 border border-gray-200 rounded-md mt-2">
          No has seleccionado ninguna especie. Añade al menos una para poder continuar.
        </div>
      )}
      
      {errors.animals_treated && (
        <p className="text-sm font-medium text-destructive mt-1">
          {errors.animals_treated.message}
        </p>
      )}
    </div>
  );
};

export default AnimalsSection;
