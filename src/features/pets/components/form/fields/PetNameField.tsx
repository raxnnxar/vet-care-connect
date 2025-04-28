
import React from 'react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface PetNameFieldProps {
  register: UseFormRegister<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
}

const PetNameField: React.FC<PetNameFieldProps> = ({ register, errors }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className="font-medium text-base">
        Nombre *
      </Label>
      <Input
        id="name"
        {...register('name', { required: "El nombre es obligatorio" })}
        placeholder="Nombre de tu mascota"
        className={errors.name ? "border-red-500" : ""}
      />
      {errors.name && (
        <p className="text-sm text-red-500 mt-1">{errors.name.message as string}</p>
      )}
    </div>
  );
};

export default PetNameField;
