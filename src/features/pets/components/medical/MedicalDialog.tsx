
import React from 'react';
import { Plus, Minus, Upload } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Pet } from '../../types';
import { usePets } from '../../hooks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/ui/molecules/dialog';

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
  const { uploadVaccineDoc, updatePet } = usePets();
  
  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<MedicalFormValues>({
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
      let vaccineDocumentUrl = null;
      
      if (data.vaccineDocument?.[0]) {
        vaccineDocumentUrl = await uploadVaccineDoc(pet.id, data.vaccineDocument[0]);
        if (!vaccineDocumentUrl) {
          toast.error('Error al subir el documento de vacunas');
          return;
        }
      }

      const medicalHistory = {
        pet_id: pet.id,
        vaccines_document_url: vaccineDocumentUrl,
        current_medications: data.medications.filter(m => m.name.trim() !== ''),
        previous_surgeries: data.surgeries.filter(s => s.type.trim() !== ''),
        allergies: data.allergies,
        chronic_conditions: data.chronicConditions
      };

      await updatePet(pet.id, { medicalHistory });
      
      toast.success('Información médica guardada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error saving medical information:', error);
      toast.error('Error al guardar la información médica');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Información médica para {pet.name}</DialogTitle>
          <DialogDescription>
            Agrega información médica importante para tu mascota
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Omitir por ahora
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalDialog;
