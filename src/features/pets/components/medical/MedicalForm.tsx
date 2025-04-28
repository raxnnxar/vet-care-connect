
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Stethoscope } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { toast } from 'sonner';
import { Pet } from '../../types';
import { usePets } from '../../hooks';
import MedicationsSection from './MedicationsSection';
import SurgeriesSection from './SurgeriesSection';
import MedicalConditionsSection from './MedicalConditionsSection';
import VaccineUploadSection from './VaccineUploadSection';
import { DialogFooter } from '@/ui/molecules/dialog';

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
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { uploadVaccineDoc, updatePet } = usePets();
  
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

  const handleFileUpload = async (files: FileList | null) => {
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
      const documentUrl = await uploadVaccineDoc(pet.id, file);
      if (documentUrl) {
        setUploadedDocumentUrl(documentUrl);
      } else {
        setUploadError('Error al subir el documento');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError('Error al subir el documento');
    } finally {
      setUploadingDocument(false);
    }
  };

  const onSubmit = async (data: MedicalFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Format data for medical history update
      const medicalHistory = {
        pet_id: pet.id,
        vaccines_document_url: uploadedDocumentUrl,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <DialogFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          type="submit" 
          className="w-full sm:w-auto bg-[#79D0B8] hover:bg-[#5FBFB3]"
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
          Omitir por ahora
        </Button>
      </DialogFooter>
    </form>
  );
};

export default MedicalForm;
