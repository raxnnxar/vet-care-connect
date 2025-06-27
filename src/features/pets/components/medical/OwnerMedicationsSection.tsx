
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/molecules/select';
import { Plus, X } from 'lucide-react';
import { UseFormRegister, UseFieldArrayReturn, Control, Controller } from 'react-hook-form';
import { MedicalFormValues } from '@/features/pets/types/formTypes';

interface OwnerMedicationsSectionProps {
  medicationFields: UseFieldArrayReturn<MedicalFormValues, "medications", "id">["fields"];
  appendMedication: UseFieldArrayReturn<MedicalFormValues, "medications", "id">["append"];
  removeMedication: UseFieldArrayReturn<MedicalFormValues, "medications", "id">["remove"];
  register: UseFormRegister<MedicalFormValues>;
  control: Control<MedicalFormValues>;
}

const OwnerMedicationsSection = ({ 
  medicationFields, 
  appendMedication, 
  removeMedication, 
  register,
  control
}: OwnerMedicationsSectionProps) => {
  const handleAddMedication = () => {
    const today = new Date().toISOString().split('T')[0];
    appendMedication({
      name: '',
      dosage: '',
      frequency_hours: 8,
      start_date: today,
      category: 'cronico'
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-base text-gray-800">Medicamentos actuales (Componente obsoleto)</h3>
          <p className="text-sm text-gray-600 mt-1">
            Este componente ha sido reemplazado por OnboardingMedicationsSection
          </p>
        </div>
      </div>

      <div className="text-center p-4 border border-dashed rounded-lg bg-gray-50">
        <p className="text-sm text-gray-500">
          Este componente ya no se usa - utilizar OnboardingMedicationsSection
        </p>
      </div>
    </div>
  );
};

export default OwnerMedicationsSection;
