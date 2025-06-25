
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { UseFormRegister } from 'react-hook-form';
import { MedicalFormValues } from '@/features/pets/types/formTypes';

interface ChronicConditionsSectionProps {
  register: UseFormRegister<MedicalFormValues>;
}

const ChronicConditionsSection = ({ register }: ChronicConditionsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="chronicConditions">
        Condiciones crónicas
      </Label>
      <Input
        {...register('chronicConditions')}
        id="chronicConditions"
        placeholder="Describe cualquier condición crónica..."
      />
      <p className="text-sm text-gray-600">
        Incluye condiciones como diabetes, artritis, problemas cardíacos, etc.
      </p>
    </div>
  );
};

export default ChronicConditionsSection;
