
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { UseFormRegister } from 'react-hook-form';

interface ChronicConditionsSectionProps {
  register: UseFormRegister<any>;
}

// Este componente está obsoleto - usar OnboardingChronicConditionsSection en su lugar
const ChronicConditionsSection = ({ register }: ChronicConditionsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="chronicConditions">
        Condiciones crónicas (Componente obsoleto)
      </Label>
      <Input
        {...register('chronicConditions')}
        id="chronicConditions"
        placeholder="Este componente será eliminado - usar las nuevas tablas"
        disabled
      />
      <p className="text-sm text-gray-600">
        Este componente ya no se usa - utilizar OnboardingChronicConditionsSection
      </p>
    </div>
  );
};

export default ChronicConditionsSection;
