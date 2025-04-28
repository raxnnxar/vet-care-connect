
import React from 'react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { UseFormRegister } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface PetTemperamentFieldProps {
  register: UseFormRegister<PetFormValues>;
}

const PetTemperamentField: React.FC<PetTemperamentFieldProps> = ({ register }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="temperament" className="font-medium text-base">
        Temperamento
      </Label>
      <Input
        id="temperament"
        {...register('temperament')}
        placeholder="Ej: Juguetón, Tranquilo, Cariñoso"
      />
    </div>
  );
};

export default PetTemperamentField;
