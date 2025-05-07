
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
  // Usando useController para manejar el estado del formulario con seguridad de tipos
  const { field } = useController({
    name: 'animals_treated',
    control,
    // Siempre proporcionar un valor por defecto para evitar "undefined"
    defaultValue: [],
  });
  
  // Asegurarnos de que el valor siempre sea un array, incluso si viene como undefined o null
  const animalsValue: string[] = Array.isArray(field.value) ? field.value : [];
  
  // Manejador para actualizar el valor del campo
  const handleChange = (newAnimals: string[]) => {
    field.onChange(newAnimals);
  };
  
  // Manejador para eliminar una especie animal
  const handleRemoveAnimal = (animalValue: string) => {
    if (!animalValue) return;
    const newValues = animalsValue.filter(val => val !== animalValue);
    field.onChange(newValues);
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Selecciona los tipos de especies que atiendes en tu práctica
      </p>
      
      {/* Selector de animales con implementación robusta */}
      <AnimalsSelector 
        selectedAnimals={animalsValue}
        onChange={handleChange}
      />

      {/* Lista de animales seleccionados */}
      <AnimalsList 
        selectedAnimals={animalsValue} 
        onRemove={handleRemoveAnimal} 
      />
    </div>
  );
};

export default AnimalsSection;
