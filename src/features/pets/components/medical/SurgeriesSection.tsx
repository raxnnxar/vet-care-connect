
import React from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Plus, Minus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
      <Label className="font-medium text-base">
        Cirugías previas
      </Label>
      <div className="space-y-4">
        {surgeryFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <div className="grid grid-cols-2 gap-2 flex-1">
              <Input
                {...register(`surgeries.${index}.type`)}
                placeholder="Tipo de cirugía"
                className="col-span-1"
              />
              <Input
                {...register(`surgeries.${index}.date`)}
                placeholder="Fecha (MM/YYYY)"
                className="col-span-1"
              />
            </div>
            {index > 0 && (
              <Button 
                type="button" 
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => remove(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => append({ 
            id: uuidv4(), 
            type: '', 
            date: '' 
          })}
        >
          <Plus className="h-4 w-4" />
          <span>Agregar cirugía</span>
        </Button>
      </div>
    </div>
  );
};

export default SurgeriesSection;
