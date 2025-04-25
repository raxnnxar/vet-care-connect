
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Stethoscope, Plus, Minus, Upload } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { toast } from 'sonner';
import { Pet } from '../../types';
import { usePets } from '../../hooks';

interface MedicalFormProps {
  pet: Pet;
  onClose: () => void;
  onSuccess: () => void;
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

const MedicalForm: React.FC<MedicalFormProps> = ({ pet, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePet, uploadVaccineDoc } = usePets();

  const { register, handleSubmit, control, formState: { errors } } = useForm<MedicalFormValues>({
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
      
      let vaccineDocumentUrl = null;
      
      // Handle vaccine document upload if present
      if (data.vaccineDocument?.[0]) {
        vaccineDocumentUrl = await uploadVaccineDoc(pet.id, data.vaccineDocument[0]);
        if (!vaccineDocumentUrl) {
          toast.error('Error al subir el documento de vacunas');
          return;
        }
      }

      // Format data for medical history update
      const medicalHistory = {
        pet_id: pet.id,
        vaccines_document_url: vaccineDocumentUrl,
        current_medications: data.medications.filter(m => m.name.trim() !== ''),
        previous_surgeries: data.surgeries.filter(s => s.type.trim() !== ''),
        allergies: data.allergies,
        chronic_conditions: data.chronicConditions
      };

      // Update pet with medical history
      await updatePet(pet.id, { medicalHistory });
      
      toast.success('Información médica guardada exitosamente');
      onSuccess();
    } catch (error) {
      console.error('Error saving medical information:', error);
      toast.error('Error al guardar la información médica');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="vaccineDocument">Documento de vacunas</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="vaccineDocument"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              {...register('vaccineDocument')}
            />
            <Upload className="h-4 w-4 text-gray-500" />
          </div>
        </div>

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
                onClick={() => removeMedication(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendMedication({ name: '', dosage: '', frequency: '' })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar medicamento
          </Button>
        </div>

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
                onClick={() => removeSurgery(index)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => appendSurgery({ type: '', date: '' })}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar cirugía
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Alergias</Label>
          <Textarea
            id="allergies"
            placeholder="Alergias conocidas"
            {...register('allergies')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chronicConditions">Condiciones crónicas</Label>
          <Textarea
            id="chronicConditions"
            placeholder="Condiciones médicas crónicas"
            {...register('chronicConditions')}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
        <Button 
          type="submit" 
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          <Stethoscope className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default MedicalForm;
