
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Syringe } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { usePets } from '../hooks/usePets';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Pet, UpdatePetData, PetMedicalHistory } from '../types';
import VaccineUploadSection from './medical/VaccineUploadSection';
import MedicationsSection from './medical/MedicationsSection';
import SurgeriesSection from './medical/SurgeriesSection';
import MedicalConditionsSection from './medical/MedicalConditionsSection';

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
        <VaccineUploadSection
          onFileUpload={handleFileUpload}
          uploadingDocument={uploadingDocument}
          uploadedDocumentUrl={uploadedDocumentUrl}
          uploadError={uploadError}
        />
        
        <MedicationsSection
          medicationFields={medicationFields}
          register={register}
          append={appendMedication}
          remove={removeMedication}
        />
        
        <MedicalConditionsSection register={register} />
        
        <SurgeriesSection
          surgeryFields={surgeryFields}
          register={register}
          append={appendSurgery}
          remove={removeSurgery}
        />
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
