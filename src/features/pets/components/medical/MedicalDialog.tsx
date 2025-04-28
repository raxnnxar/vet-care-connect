
import React, { useState } from 'react';
import { Pet } from '../../types';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/ui/molecules/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/ui/atoms/button';
import { Syringe, Plus, Minus, FilePlus } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { toast } from 'sonner';
import { usePets } from '../../hooks';
import { Alert, AlertDescription } from '@/ui/molecules/alert';

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
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { uploadVaccineDoc, updatePet } = usePets();

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      setUploadError('No se seleccionó ningún archivo');
      return;
    }

    const file = files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSizeInBytes) {
      setUploadError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    setUploadingDocument(true);
    setUploadError(null);
    
    try {
      console.log('Uploading vaccine document for pet:', pet.id);
      const documentUrl = await uploadVaccineDoc(pet.id, file);
      
      if (documentUrl) {
        console.log('Upload successful, URL:', documentUrl);
        setUploadedDocumentUrl(documentUrl);
        toast.success('Documento subido exitosamente');
      } else {
        console.error('Upload returned no URL');
        setUploadError('Error al subir el documento');
        toast.error('Error al subir el documento');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError('Error al subir el documento');
      toast.error('Error al subir el documento');
    } finally {
      setUploadingDocument(false);
    }
  };

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting medical data for pet:', pet.id);
      
      // Format data for medical history update
      const medicalHistory = {
        pet_id: pet.id,
        vaccines_document_url: uploadedDocumentUrl,
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
        <DialogHeader>
          <DialogTitle>Información médica para {pet.name}</DialogTitle>
          <DialogDescription>
            Agrega información médica importante para tu mascota
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Vaccine Document Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="vaccineDocument" className="font-medium text-base">
              Registro de vacunas
            </Label>
            <div className="flex flex-col gap-2">
              <div className="border-2 border-dashed border-primary/40 rounded-md p-4 text-center hover:border-primary transition-colors">
                <input
                  id="vaccineDocument"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingDocument}
                />
                <Label 
                  htmlFor="vaccineDocument" 
                  className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
                >
                  <FilePlus className="h-8 w-8 text-primary" />
                  <span className="font-medium">
                    {uploadingDocument ? 'Subiendo...' : 'Subir documento de vacunas (PDF/Imagen)'}
                  </span>
                  <span className="text-xs text-muted-foreground">Máximo 5MB</span>
                </Label>
              </div>
              
              {uploadError && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">{uploadError}</AlertDescription>
                </Alert>
              )}
              
              {uploadedDocumentUrl && (
                <Alert className="bg-green-50 text-green-700 py-2">
                  <AlertDescription className="flex items-center gap-2">
                    <FilePlus className="h-4 w-4" />
                    <a 
                      href={uploadedDocumentUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm underline hover:text-green-800"
                    >
                      Documento subido exitosamente - Ver documento
                    </a>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        
          {/* Medications Section */}
          <div className="space-y-2">
            <Label className="font-medium text-base">Medicamentos actuales</Label>
            {medicationFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <div className="w-1/3">
                  <Input
                    placeholder="Nombre"
                    {...register(`medications.${index}.name`)}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    placeholder="Dosis"
                    {...register(`medications.${index}.dosage`)}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    placeholder="Frecuencia"
                    {...register(`medications.${index}.frequency`)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMedication(index)}
                >
                  <Minus className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendMedication({ name: '', dosage: '', frequency: '' })}
              className="w-full bg-background hover:bg-accent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar medicamento
            </Button>
          </div>
          
          {/* Medical Conditions Section */}
          <div className="space-y-2">
            <Label htmlFor="allergies" className="font-medium text-base">
              Alergias
            </Label>
            <Textarea
              id="allergies"
              placeholder="Alergias conocidas"
              {...register('allergies')}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chronicConditions" className="font-medium text-base">
              Condiciones crónicas
            </Label>
            <Textarea
              id="chronicConditions"
              placeholder="Condiciones médicas crónicas"
              {...register('chronicConditions')}
              className="resize-none"
            />
          </div>
          
          {/* Surgeries Section */}
          <div className="space-y-2">
            <Label className="font-medium text-base">Cirugías previas</Label>
            {surgeryFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center">
                <div className="w-2/3">
                  <Input
                    placeholder="Tipo de cirugía"
                    {...register(`surgeries.${index}.type`)}
                  />
                </div>
                <div className="w-1/3">
                  <Input
                    type="date"
                    {...register(`surgeries.${index}.date`)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSurgery(index)}
                >
                  <Minus className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => appendSurgery({ type: '', date: '' })}
              className="w-full bg-background hover:bg-accent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar cirugía
            </Button>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
              disabled={isSubmitting}
            >
              <Syringe className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Guardando...' : 'Guardar información médica'}
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
