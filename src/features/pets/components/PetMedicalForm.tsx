
import React, { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Plus, Minus, FilePlus, AlertTriangle, 
  Upload, Syringe 
} from 'lucide-react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Button } from '@/ui/atoms/button';
import { usePets } from '../hooks/usePets';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Pet, UpdatePetData, PetMedicalHistory } from '../types';

interface PetMedicalFormProps {
  pet: Pet;
  onComplete: () => void;
  onSkip: () => void;
}

interface MedicalFormValues {
  allergies?: string;
  chronicConditions?: string;
  vaccineDocument?: FileList;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
  }>;
  surgeries: Array<{
    id: string;
    type: string;
    date: string;
  }>;
}

const PetMedicalForm: React.FC<PetMedicalFormProps> = ({ pet, onComplete, onSkip }) => {
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const vaccineDocInputRef = useRef<HTMLInputElement>(null);
  const { uploadVaccineDoc, updatePet } = usePets();

  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<MedicalFormValues>({
    defaultValues: {
      medications: [{ id: uuidv4(), name: '', dosage: '', frequency: '' }],
      surgeries: [{ id: uuidv4(), type: '', date: '' }]
    }
  });

  const { fields: medicationFields, append: appendMedication, remove: removeMedication } = 
    useFieldArray({ control, name: "medications" });
    
  const { fields: surgeryFields, append: appendSurgery, remove: removeSurgery } = 
    useFieldArray({ control, name: "surgeries" });

  const handleFileUpload = async (files: FileList | null) => {
    setUploadError(null);
    
    if (!files || files.length === 0) {
      setUploadError("No se ha seleccionado ningún archivo");
      toast.error("No se ha seleccionado ningún archivo");
      return;
    }
    
    if (!pet?.id) {
      setUploadError("Error al identificar la mascota");
      toast.error("Error al identificar la mascota");
      return;
    }
    
    const file = files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      setUploadError("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      toast.error("El archivo es demasiado grande. El tamaño máximo es 5MB.");
      return;
    }
    
    setUploadingDocument(true);
    
    try {
      const documentUrl = await uploadVaccineDoc(pet.id, file);
      
      if (documentUrl) {
        setUploadedDocumentUrl(documentUrl);
        toast.success("Documento subido exitosamente");
      } else {
        setUploadError("Error al subir el documento al servidor");
        toast.error("Error al subir el documento");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError("Error al subir el documento. Intenta nuevamente.");
      toast.error("Error al subir el documento. Intenta nuevamente.");
    } finally {
      setUploadingDocument(false);
    }
  };

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      const medicalHistory: PetMedicalHistory = {
        allergies: data.allergies || null,
        chronic_conditions: data.chronicConditions || null,
        vaccines_document_url: uploadedDocumentUrl,
        current_medications: data.medications
          .filter(m => m.name.trim() !== '')
          .map(med => ({
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency
          })),
        previous_surgeries: data.surgeries
          .filter(s => s.type.trim() !== '')
          .map(surgery => ({
            type: surgery.type,
            date: surgery.date
          }))
      };

      const updateData: UpdatePetData = { medicalHistory };
      await updatePet(pet.id, updateData);
      toast.success('Información médica guardada exitosamente');
      onComplete();
    } catch (error) {
      console.error('Error saving medical information:', error);
      toast.error('Error al guardar la información médica');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-primary mb-2">
          Información médica para {pet.name}
        </h2>
        <p className="text-muted-foreground">
          Registra la información médica importante de tu mascota
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vaccineDocument" className="font-medium text-base">
            Registro de vacunas
          </Label>
          <div className="flex flex-col gap-2">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors">
              <input
                id="vaccineDocument"
                ref={vaccineDocInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                disabled={uploadingDocument}
              />
              <Label 
                htmlFor="vaccineDocument" 
                className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Upload className="h-8 w-8" />
                <span>
                  {uploadingDocument ? 'Subiendo...' : 'Subir documento de vacunas (PDF/Imagen)'}
                </span>
                <span className="text-xs text-muted-foreground">Máximo 5MB</span>
              </Label>
            </div>
            
            {uploadError && (
              <div className="bg-red-50 text-red-700 p-2 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{uploadError}</span>
              </div>
            )}
            
            {uploadedDocumentUrl && (
              <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center gap-2">
                <FilePlus className="h-4 w-4" />
                <a 
                  href={uploadedDocumentUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm underline hover:text-green-800"
                >
                  Documento subido exitosamente - Ver documento
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-base">
            Medicamentos actuales
          </Label>
          <div className="space-y-4">
            {medicationFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="grid grid-cols-3 gap-2 flex-1">
                  <Input
                    {...register(`medications.${index}.name`)}
                    placeholder="Nombre del medicamento"
                    className="col-span-1"
                  />
                  <Input
                    {...register(`medications.${index}.dosage`)}
                    placeholder="Dosis (mg, ml, etc.)"
                    className="col-span-1"
                  />
                  <Input
                    {...register(`medications.${index}.frequency`)}
                    placeholder="Frecuencia"
                    className="col-span-1"
                  />
                </div>
                {index > 0 && (
                  <Button 
                    type="button" 
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => removeMedication(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => appendMedication({ 
                id: uuidv4(), 
                name: '', 
                dosage: '', 
                frequency: '' 
              })}
            >
              <Plus className="h-4 w-4" />
              <span>Agregar medicamento</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="allergies" className="font-medium text-base">
            Alergias
          </Label>
          <Textarea
            id="allergies"
            {...register('allergies')}
            placeholder="Alergias conocidas del animal"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chronicConditions" className="font-medium text-base">
            Condiciones crónicas
          </Label>
          <Textarea
            id="chronicConditions"
            {...register('chronicConditions')}
            placeholder="Condiciones médicas crónicas"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="font-medium text-base">
            Cirugías previas
          </Label>
          <div className="space-y-4">
            {surgeryFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <Input
                    {...register(`surgeries.${index}.type`)}
                    placeholder="Tipo de cirugía"
                    className="col-span-1"
                  />
                  <Input
                    {...register(`surgeries.${index}.date`)}
                    placeholder="Fecha (MM/YYYY)"
                    className="col-span-1"
                  />
                </div>
                {index > 0 && (
                  <Button 
                    type="button" 
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => removeSurgery(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => appendSurgery({ 
                id: uuidv4(), 
                type: '', 
                date: '' 
              })}
            >
              <Plus className="h-4 w-4" />
              <span>Agregar cirugía</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 text-base font-medium flex items-center justify-center gap-2"
          disabled={isSubmitting || uploadingDocument}
        >
          <Syringe className="h-4 w-4" />
          {isSubmitting ? 'Guardando...' : 'Guardar información médica'}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onSkip}
          className="w-full text-center"
        >
          Completar más tarde
        </Button>
      </div>
    </form>
  );
};

export default PetMedicalForm;
