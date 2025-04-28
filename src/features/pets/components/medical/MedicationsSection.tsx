
import React from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Plus, Minus } from 'lucide-react';

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
      <Label>Medicamentos actuales</Label>
      {medicationFields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            placeholder="Nombre"
            {...register(`medications.${index}.name`)}
          />
          <Input
            placeholder="Dosis"
            {...register(`medications.${index}.dosage`)}
          />
          <Input
            placeholder="Frecuencia"
            {...register(`medications.${index}.frequency`)}
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
        onClick={() => append({ name: '', dosage: '', frequency: '' })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar medicamento
      </Button>
    </div>
  );
};

export default MedicationsSection;
