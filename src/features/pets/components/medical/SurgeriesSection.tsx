
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { UseFormRegister, UseFieldArrayReturn } from 'react-hook-form';

interface SurgeriesSectionProps {
  surgeryFields: any[];
  appendSurgery: UseFieldArrayReturn<any, "surgeries">['append'];
  removeSurgery: UseFieldArrayReturn<any, "surgeries">['remove'];
  register: UseFormRegister<any>;
}

// Este componente está obsoleto - usar OnboardingSurgeriesSection en su lugar
const SurgeriesSection = ({ 
  surgeryFields, 
  appendSurgery, 
  removeSurgery, 
  register 
}: SurgeriesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-base">Cirugías previas (Componente obsoleto)</Label>
      <p className="text-sm text-gray-600">
        Este componente ya no se usa - utilizar OnboardingSurgeriesSection
      </p>
      <Button
        type="button"
        variant="outline"
        disabled
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Componente obsoleto
      </Button>
    </div>
  );
};

export default SurgeriesSection;
