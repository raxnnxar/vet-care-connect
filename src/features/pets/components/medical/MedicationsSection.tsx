
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { UseFormRegister, UseFieldArrayReturn } from 'react-hook-form';
import { MedicalFormValues } from '@/features/pets/types/formTypes';

interface MedicationsSectionProps {
  medicationFields: any[];
  appendMedication: UseFieldArrayReturn<MedicalFormValues, "medications">['append'];
  removeMedication: UseFieldArrayReturn<MedicalFormValues, "medications">['remove'];
  register: UseFormRegister<MedicalFormValues>;
}

const MedicationsSection = ({ 
  medicationFields, 
  appendMedication, 
  removeMedication, 
  register 
}: MedicationsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium text-base">Medicamentos actuales</Label>
      {medicationFields.map((field, index) => (
        <div key={field.id} className="grid grid-cols-3 gap-2 mb-2">
          <Input
            placeholder="Nombre"
            {...register(`medications.${index}.name`)}
          />
          <Input
            placeholder="Dosis"
            {...register(`medications.${index}.dosage`)}
          />
          <div className="flex">
            <Input
              placeholder="Frecuencia"
              {...register(`medications.${index}.frequency`)}
              className="flex-grow"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeMedication(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() => appendMedication({ name: '', dosage: '', frequency: '' })}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Agregar medicamento
      </Button>
    </div>
  );
};

export default MedicationsSection;
