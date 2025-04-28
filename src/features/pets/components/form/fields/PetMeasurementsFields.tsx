
import React from 'react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PetFormValues } from '@/features/pets/types/formTypes';

interface PetMeasurementsFieldsProps {
  register: UseFormRegister<PetFormValues>;
  errors: FieldErrors<PetFormValues>;
}

const PetMeasurementsFields: React.FC<PetMeasurementsFieldsProps> = ({ register, errors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="age" className="font-medium text-base">
          Edad (años)
        </Label>
        <Input
          id="age"
          type="number"
          {...register('age', { 
            valueAsNumber: true,
            min: { value: 0, message: "La edad no puede ser negativa" },
            max: { value: 100, message: "La edad parece ser demasiado alta" }
          })}
          placeholder="Edad en años"
          className={errors.age ? "border-red-500" : ""}
        />
        {errors.age && (
          <p className="text-sm text-red-500 mt-1">{errors.age.message as string}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="weight" className="font-medium text-base">
          Peso (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          {...register('weight', { 
            valueAsNumber: true,
            min: { value: 0, message: "El peso no puede ser negativo" },
            max: { value: 1000, message: "El peso parece ser demasiado alto" }
          })}
          placeholder="Peso en kg"
          className={errors.weight ? "border-red-500" : ""}
        />
        {errors.weight && (
          <p className="text-sm text-red-500 mt-1">{errors.weight.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default PetMeasurementsFields;
