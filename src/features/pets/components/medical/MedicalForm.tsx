
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MedicalFormValues } from '@/features/pets/types/formTypes';
import SurgeriesSection from './SurgeriesSection';
import AllergiesSection from './AllergiesSection';
import ChronicConditionsSection from './ChronicConditionsSection';
import OwnerMedicationsSection from './OwnerMedicationsSection';

interface MedicalFormProps {
  petId: string;
  onComplete: () => void;
}

const MedicalForm: React.FC<MedicalFormProps> = ({ petId, onComplete }) => {
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<MedicalFormValues>({
    defaultValues: {
      surgeries: [],
      allergies: '',
      chronicConditions: '',
      medications: []
    }
  });

  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = useFieldArray({
    control,
    name: 'surgeries'
  });

  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = useFieldArray({
    control,
    name: 'medications'
  });

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      // This form is now obsolete - just complete the flow
      // The new onboarding process uses the specialized components
      toast.success('Información médica guardada exitosamente');
      onComplete();
    } catch (error) {
      console.error('Error saving medical data:', error);
      toast.error('Error al guardar la información médica');
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Información Médica (Componente obsoleto)
        </h2>
        <p className="text-sm text-gray-600">
          Este formulario está siendo reemplazado por los nuevos componentes especializados
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onComplete}
            className="flex-1"
          >
            Omitir por ahora
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
          >
            {isSubmitting ? 'Guardando...' : 'Continuar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MedicalForm;
