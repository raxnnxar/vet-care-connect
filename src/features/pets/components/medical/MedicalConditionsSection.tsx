
import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';

interface MedicalConditionsSectionProps {
  register: UseFormRegister<any>;
}

const MedicalConditionsSection = ({ register }: MedicalConditionsSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="allergies" className="font-medium text-base">
          Alergias
        </Label>
        <Textarea
          id="allergies"
          {...register('allergies')}
          placeholder="Alergias conocidas del animal"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chronicConditions" className="font-medium text-base">
          Condiciones crónicas
        </Label>
        <Textarea
          id="chronicConditions"
          {...register('chronicConditions')}
          placeholder="Condiciones médicas crónicas"
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};

export default MedicalConditionsSection;
