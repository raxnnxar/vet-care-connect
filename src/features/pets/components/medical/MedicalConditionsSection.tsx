
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';

interface MedicalConditionsSectionProps {
  register: any;
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
          placeholder="Alergias conocidas"
          {...register('allergies')}
          className="min-h-24"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chronicConditions" className="font-medium text-base">
          Condiciones crónicas
        </Label>
        <Textarea
          id="chronicConditions"
          placeholder="Condiciones médicas crónicas"
          {...register('chronicConditions')}
          className="min-h-24"
        />
      </div>
    </>
  );
};

export default MedicalConditionsSection;
