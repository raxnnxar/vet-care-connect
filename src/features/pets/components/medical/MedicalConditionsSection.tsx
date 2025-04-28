
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
        <Label htmlFor="allergies">
          Alergias
        </Label>
        <Textarea
          id="allergies"
          placeholder="Alergias conocidas"
          {...register('allergies')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chronicConditions">
          Condiciones crónicas
        </Label>
        <Textarea
          id="chronicConditions"
          placeholder="Condiciones médicas crónicas"
          {...register('chronicConditions')}
        />
      </div>
    </>
  );
};

export default MedicalConditionsSection;
