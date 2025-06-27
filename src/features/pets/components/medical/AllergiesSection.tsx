
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { UseFormRegister } from 'react-hook-form';

interface AllergiesSectionProps {
  register: UseFormRegister<any>;
}

// Este componente está obsoleto - usar OnboardingAllergiesSection en su lugar
const AllergiesSection = ({ register }: AllergiesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="allergies">
        Alergias conocidas (Componente obsoleto)
      </Label>
      <Input
        {...register('allergies')}
        id="allergies"
        placeholder="Este componente será eliminado - usar las nuevas tablas"
        disabled
      />
      <p className="text-sm text-gray-600">
        Este componente ya no se usa - utilizar OnboardingAllergiesSection
      </p>
    </div>
  );
};

export default AllergiesSection;
