
import React, { useState } from 'react';
import { Pet } from '../../types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/ui/molecules/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/ui/atoms/button';
import { Syringe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import VaccineDocumentUpload from './VaccineDocumentUpload';
import SurgeriesSection from './SurgeriesSection';
import MedicalConditionsSection from './MedicalConditionsSection';
import MedicalDialogHeader from './MedicalDialogHeader';
import MedicalInfoViewer from './MedicalInfoViewer';
import { MedicalFormValues } from '@/features/pets/types/formTypes';

interface MedicalDialogProps {
  pet: Pet;
  onClose: () => void;
  open: boolean;
  mode?: 'edit' | 'view';
}

const MedicalDialog: React.FC<MedicalDialogProps> = ({ pet, onClose, open, mode = 'edit' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control } = useForm<MedicalFormValues>({
    defaultValues: {
      surgeries: [{ type: '', date: '' }],
      allergies: '',
      chronicConditions: ''
    }
  });

  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = 
    useFieldArray({ control, name: "surgeries" });

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting medical data for pet:', pet.id);
      
      // Prepare medical history data without current_medications
      const medicalHistoryData = {
        pet_id: pet.id,
        previous_surgeries: data.surgeries.filter(s => s.type.trim() !== ''),
        allergies: data.allergies || null,
        chronic_conditions: data.chronicConditions || null
      };

      console.log('Medical history data to save:', medicalHistoryData);
      
      // Check if medical history already exists for this pet
      const { data: existingHistory, error: fetchError } = await supabase
        .from('pet_medical_history')
        .select('id')
        .eq('pet_id', pet.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing medical history:', fetchError);
        throw fetchError;
      }

      let result;
      if (existingHistory) {
        // Update existing medical history
        const { data: updateData, error: updateError } = await supabase
          .from('pet_medical_history')
          .update(medicalHistoryData)
          .eq('pet_id', pet.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating medical history:', updateError);
          throw updateError;
        }
        result = updateData;
      } else {
        // Create new medical history
        const { data: insertData, error: insertError } = await supabase
          .from('pet_medical_history')
          .insert(medicalHistoryData)
          .select()
          .single();

        if (insertError) {
          console.error('Error creating medical history:', insertError);
          throw insertError;
        }
        result = insertData;
      }

      console.log('Medical history saved successfully:', result);
      toast.success('Información médica guardada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error saving medical information:', error);
      toast.error('Error al guardar la información médica');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <MedicalDialogHeader 
            petName={pet.name}
          />
        </DialogHeader>

        {mode === 'view' ? (
          <MedicalInfoViewer pet={pet} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Vaccine Document Upload Section */}
            <VaccineDocumentUpload 
              petId={pet.id} 
              petOwnerId={pet.owner_id}
            />
            
            {/* Medical Conditions Section */}
            <MedicalConditionsSection register={register} />
            
            {/* Surgeries Section */}
            <SurgeriesSection 
              surgeryFields={surgeryFields}
              appendSurgery={appendSurgery}
              removeSurgery={removeSurgery}
              register={register}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
                disabled={isSubmitting}
              >
                <Syringe className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Guardando...' : 'Guardar información médica'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicalDialog;
