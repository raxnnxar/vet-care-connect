
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { UseFieldArrayReturn } from 'react-hook-form';

interface SurgeriesSectionProps {
  surgeryFields: any[];
  appendSurgery: UseFieldArrayReturn['append'];
  removeSurgery: UseFieldArrayReturn['remove'];
  register: any;
}

const SurgeriesSection = ({ 
  surgeryFields, 
  appendSurgery, 
  removeSurgery, 
  register 
}: SurgeriesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-base">Cirugías previas</Label>
      {surgeryFields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            placeholder="Tipo de cirugía"
            {...register(`surgeries.${index}.type`)}
          />
          <Input
            type="date"
            {...register(`surgeries.${index}.date`)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeSurgery(index)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => appendSurgery({ type: '', date: '' })}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Agregar cirugía
      </Button>
    </div>
  );
};

export default SurgeriesSection;
