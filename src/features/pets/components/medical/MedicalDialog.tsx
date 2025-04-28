
import React, { useState } from 'react';
import { Pet } from '../../types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from '@/ui/molecules/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/ui/atoms/button';
import { Syringe } from 'lucide-react';
import { toast } from 'sonner';
import { usePets } from '../../hooks';
import VaccineDocumentUpload from './VaccineDocumentUpload';
import MedicationsSection from './MedicationsSection';
import SurgeriesSection from './SurgeriesSection';
import MedicalConditionsSection from './MedicalConditionsSection';
import MedicalDialogHeader from './MedicalDialogHeader';

interface MedicalDialogProps {
  pet: Pet;
  onClose: () => void;
  open: boolean;
}

interface MedicalFormValues {
  vaccineDocument?: FileList;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
  }>;
  surgeries: Array<{
    type: string;
    date: string;
  }>;
  allergies: string;
  chronicConditions: string;
}

const MedicalDialog: React.FC<MedicalDialogProps> = ({ pet, onClose, open }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePet } = usePets();

  const { register, handleSubmit, control } = useForm<MedicalFormValues>({
    defaultValues: {
      medications: [{ name: '', dosage: '', frequency: '' }],
      surgeries: [{ type: '', date: '' }],
      allergies: '',
      chronicConditions: ''
    }
  });

  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = 
    useFieldArray({ control, name: "medications" });
    
  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = 
    useFieldArray({ control, name: "surgeries" });

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting medical data for pet:', pet.id);
      
      // Format data for medical history update
      const medicalHistory = {
        pet_id: pet.id,
        current_medications: data.medications.filter(m => m.name.trim() !== ''),
        previous_surgeries: data.surgeries.filter(s => s.type.trim() !== ''),
        allergies: data.allergies,
        chronic_conditions: data.chronicConditions
      };

      console.log('Formatted medical history data:', medicalHistory);
      
      // Update pet with medical history
      const result = await updatePet(pet.id, { medicalHistory });
      console.log('Update pet result:', result);
      
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
            onSkipMedical={onClose}
          />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Vaccine Document Upload Section */}
          <VaccineDocumentUpload petId={pet.id} />
        
          {/* Medications Section */}
          <MedicationsSection 
            medicationFields={medicationFields}
            appendMedication={appendMedication}
            removeMedication={removeMedication}
            register={register}
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

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
              disabled={isSubmitting}
            >
              <Syringe className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar información médica'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalDialog;
