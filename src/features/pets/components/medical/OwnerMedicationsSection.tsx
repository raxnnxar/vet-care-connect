
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Checkbox } from '@/ui/atoms/checkbox';
import { Plus, X } from 'lucide-react';
import { UseFormRegister, UseFieldArrayReturn } from 'react-hook-form';
import { MedicalFormValues } from '@/features/pets/types/formTypes';

interface OwnerMedicationsSectionProps {
  medicationFields: UseFieldArrayReturn<MedicalFormValues, "medications", "id">["fields"];
  appendMedication: UseFieldArrayReturn<MedicalFormValues, "medications", "id">["append"];
  removeMedication: UseFieldArrayReturn<MedicalFormValues, "medications", "id">["remove"];
  register: UseFormRegister<MedicalFormValues>;
  watch: (name: string) => any;
}

const OwnerMedicationsSection = ({ 
  medicationFields, 
  appendMedication, 
  removeMedication, 
  register,
  watch
}: OwnerMedicationsSectionProps) => {
  const handleAddMedication = () => {
    const today = new Date().toISOString().split('T')[0];
    appendMedication({
      name: '',
      dosage: '',
      frequency_hours: 8,
      start_date: today,
      is_permanent: false,
      end_date: ''
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-base text-gray-800">Medicamentos actuales</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddMedication}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar medicamento
        </Button>
      </div>

      {medicationFields.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay medicamentos agregados aún
        </p>
      )}

      {medicationFields.map((field, index) => {
        const isPermanent = watch(`medications.${index}.is_permanent`);
        
        return (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm text-gray-700">
                Medicamento {index + 1}
              </h4>
              {medicationFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMedication(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`medications.${index}.name`}>
                  Nombre del medicamento *
                </Label>
                <Input
                  {...register(`medications.${index}.name` as const, { required: true })}
                  placeholder="Ej: Paracetamol"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`medications.${index}.dosage`}>
                  Dosis *
                </Label>
                <Input
                  {...register(`medications.${index}.dosage` as const, { required: true })}
                  placeholder="Ej: 250mg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`medications.${index}.frequency_hours`}>
                  Frecuencia (horas) *
                </Label>
                <Input
                  type="number"
                  {...register(`medications.${index}.frequency_hours` as const, { 
                    required: true,
                    valueAsNumber: true,
                    min: 1 
                  })}
                  placeholder="8"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`medications.${index}.start_date`}>
                  Fecha de inicio *
                </Label>
                <Input
                  type="date"
                  {...register(`medications.${index}.start_date` as const, { required: true })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...register(`medications.${index}.is_permanent` as const)}
                  id={`medications.${index}.is_permanent`}
                />
                <Label htmlFor={`medications.${index}.is_permanent`}>
                  Uso indefinido
                </Label>
              </div>

              {!isPermanent && (
                <div className="space-y-2">
                  <Label htmlFor={`medications.${index}.end_date`}>
                    Fecha de fin
                  </Label>
                  <Input
                    type="date"
                    {...register(`medications.${index}.end_date` as const)}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {medicationFields.length === 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAddMedication}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar primer medicamento
        </Button>
      )}
    </div>
  );
};

export default OwnerMedicationsSection;
