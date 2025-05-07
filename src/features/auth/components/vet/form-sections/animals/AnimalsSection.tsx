
import React from 'react';
import { Control, FieldErrors, useController } from 'react-hook-form';
import { VeterinarianProfile } from '../../../../types/veterinarianTypes';
import AnimalsSelector from './AnimalsSelector';
import AnimalsList from './AnimalsList';

interface AnimalsSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const AnimalsSection: React.FC<AnimalsSectionProps> = ({
  control,
  errors,
}) => {
  // Usando useController con un valor predeterminado explícito para evitar undefined
  const { field } = useController({
    name: 'animals_treated',
    control,
    defaultValue: [], // Siempre proporcionamos un array vacío como valor por defecto
  });
  
  // Asegurándonos de que el valor siempre sea un array, incluso si viene como undefined o null
  const animalsValue: string[] = Array.isArray(field.value) ? field.value : [];
  
  // Manejador para actualizar el valor del campo
  const handleChange = (selectedValues: string[]) => {
    // Verificar que estamos trabajando con un array
    const newValues = Array.isArray(selectedValues) ? selectedValues : [];
    field.onChange(newValues);
  };
  
  // Manejador para eliminar una especie animal
  const handleRemoveAnimal = (animalValue: string) => {
    if (!animalValue) return;
    
    // Verificar que estamos trabajando con un array antes de filtrar
    if (!Array.isArray(animalsValue)) {
      field.onChange([]);
      return;
    }
    
    const newValues = animalsValue.filter(val => val !== animalValue);
    field.onChange(newValues);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Selecciona los tipos de especies que atiendes en tu práctica
      </p>
      
      {/* Selector de especies con implementación robusta */}
      <AnimalsSelector 
        selectedAnimals={animalsValue}
        onChange={handleChange}
      />

      {/* Lista de especies seleccionadas */}
      {Array.isArray(animalsValue) && (
        <AnimalsList 
          selectedAnimals={animalsValue} 
          onRemove={handleRemoveAnimal} 
        />
      )}
    </div>
  );
};

export default AnimalsSection;
