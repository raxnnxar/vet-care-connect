
import React from 'react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface CustomSpeciesFieldProps {
  register: UseFormRegister<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
  selectedSpecies: string;
}

const CustomSpeciesField: React.FC<CustomSpeciesFieldProps> = ({ 
  register, 
  errors, 
  selectedSpecies 
}) => {
  if (selectedSpecies !== 'Otro') {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="customSpecies" className="font-medium text-base">
        Especifica el tipo de animal *
      </Label>
      <Input
        id="customSpecies"
        {...register('customSpecies', { 
          required: selectedSpecies === 'Otro' ? "Por favor especifica el tipo de animal" : false 
        })}
        placeholder="Tipo de animal"
        className={errors.customSpecies ? "border-red-500" : ""}
      />
      {errors.customSpecies && (
        <p className="text-sm text-red-500 mt-1">{errors.customSpecies.message as string}</p>
      )}
    </div>
  );
};

export default CustomSpeciesField;
