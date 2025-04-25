
import React from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Plus, Minus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MedicationsSectionProps {
  medicationFields: Record<"id" | "name" | "dosage" | "frequency", string>[];
  register: any;
  append: UseFieldArrayAppend<any, "medications">;
  remove: UseFieldArrayRemove;
}

const MedicationsSection = ({
  medicationFields,
  register,
  append,
  remove
}: MedicationsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-base">
        Medicamentos actuales
      </Label>
      <div className="space-y-4">
        {medicationFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start">
            <div className="grid grid-cols-3 gap-2 flex-1">
              <Input
                {...register(`medications.${index}.name`)}
                placeholder="Nombre del medicamento"
                className="col-span-1"
              />
              <Input
                {...register(`medications.${index}.dosage`)}
                placeholder="Dosis (mg, ml, etc.)"
                className="col-span-1"
              />
              <Input
                {...register(`medications.${index}.frequency`)}
                placeholder="Frecuencia"
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
            name: '', 
            dosage: '', 
            frequency: '' 
          })}
        >
          <Plus className="h-4 w-4" />
          <span>Agregar medicamento</span>
        </Button>
      </div>
    </div>
  );
};

export default MedicationsSection;
