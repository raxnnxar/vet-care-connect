
import React from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Plus, Minus } from 'lucide-react';

interface SurgeriesSectionProps {
  surgeryFields: Record<"id" | "type" | "date", string>[];
  register: any;
  append: UseFieldArrayAppend<any, "surgeries">;
  remove: UseFieldArrayRemove;
}

const SurgeriesSection = ({
  surgeryFields,
  register,
  append,
  remove
}: SurgeriesSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Cirugías previas</Label>
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
            onClick={() => remove(index)}
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => append({ type: '', date: '' })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar cirugía
      </Button>
    </div>
  );
};

export default SurgeriesSection;
