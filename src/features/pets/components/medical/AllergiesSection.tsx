
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { UseFormRegister } from 'react-hook-form';
import { MedicalFormValues } from '@/features/pets/types/formTypes';

interface AllergiesSectionProps {
  register: UseFormRegister<MedicalFormValues>;
}

const AllergiesSection = ({ register }: AllergiesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="allergies">
        Alergias conocidas
      </Label>
      <Input
        {...register('allergies')}
        id="allergies"
        placeholder="Describe cualquier alergia conocida..."
      />
      <p className="text-sm text-gray-600">
        Incluye alergias a medicamentos, alimentos o sustancias ambientales
      </p>
    </div>
  );
};

export default AllergiesSection;
