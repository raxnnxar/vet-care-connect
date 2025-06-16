
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface PetBreedFieldProps {
  register: UseFormRegister<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
}

const PetBreedField: React.FC<PetBreedFieldProps> = ({
  register,
  errors
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="breed">Raza</Label>
      <Input
        id="breed"
        type="text"
        placeholder="Ej. Labrador, mestizo, siamés…"
        {...register('breed')}
        className={errors.breed ? 'border-red-500' : ''}
      />
      {errors.breed && (
        <p className="text-sm text-red-500">{errors.breed.message}</p>
      )}
    </div>
  );
};

export default PetBreedField;
