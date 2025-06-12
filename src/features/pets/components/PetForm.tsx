import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import { Pet } from '@/features/pets/types';
import PetPhotoUpload from './PetPhotoUpload';
import PetBasicInfo, { speciesMapping } from './PetBasicInfo';
import { PET_CATEGORIES, PET_GENDER } from '@/core/constants/app.constants';
import { toast } from 'sonner';
import { PetFormProps } from '@/features/pets/types/PetFormProps';
import { PetFormValues } from '@/features/pets/types/formTypes';
import FormActionButtons from './form/FormActionButtons';
import FormSteps from './form/FormSteps';
import NotesSection from './form/NotesSection';
import { usePetFileUploads } from '@/features/pets/hooks/usePetFileUploads';

export const genderMapping = {
  'Macho': PET_GENDER.MALE,
  'Hembra': PET_GENDER.FEMALE,
};

const PetForm: React.FC<PetFormProps> = ({ mode, pet, onSubmit, isSubmitting, onCancel }) => {
  const [step, setStep] = useState<'basic' | 'medical'>('basic');
  const [createdPet, setCreatedPet] = useState<Pet | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  const { uploadProfilePicture } = usePetFileUploads();

  const calculateInitialValues = () => {
    if (!pet) {
      return {
        name: '',
        species: '',
        customSpecies: '',
        age: undefined,
        weight: undefined,
        sex: '',
        temperament: '',
        additionalNotes: '',
      };
    }

    let species = '';
    let customSpecies = '';
    
    if (pet.species) {
      for (const [uiSpecies, dbSpecies] of Object.entries(speciesMapping)) {
        if (dbSpecies === pet.species) {
          species = uiSpecies;
          break;
        }
      }
      
      if (!species) {
        species = 'Otro';
        customSpecies = pet.breed || '';
      }
    }

    let sex = '';
    if (pet.sex) {
      for (const [uiSex, dbSex] of Object.entries(genderMapping)) {
        if (dbSex === pet.sex) {
          sex = uiSex;
          break;
        }
      }
    }

    let age = undefined;
    if (pet.date_of_birth) {
      const birthDate = new Date(pet.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
    }

    return {
      name: pet.name || '',
      species: species,
      customSpecies: customSpecies,
      age: age,
      weight: pet.weight ? Number(pet.weight) : undefined,
      sex: sex,
      temperament: pet.temperament || '',
      additionalNotes: pet.additional_notes || '',
    };
  };

  const initialValues = calculateInitialValues();
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PetFormValues>({
    defaultValues: initialValues
  });

  React.useEffect(() => {
    if (pet?.profile_picture_url) {
      setPetPhotoPreview(pet.profile_picture_url);
    }
  }, [pet]);

  const selectedSpecies = watch('species');

  const handlePetPhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPetPhotoPreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    setPetPhotoFile(file);
  };

  const processFormData = async (data: PetFormValues) => {
    try {
      setIsUploadingPhoto(true);
      
      const transformedData: any = {
        name: data.name,
        species: data.species === 'Otro' ? PET_CATEGORIES.OTHER : speciesMapping[data.species],
        breed: data.species === 'Otro' ? data.customSpecies : '',
        additional_notes: data.additionalNotes || '',
        weight: data.weight || null,
        sex: data.sex ? genderMapping[data.sex] : null,
        temperament: data.temperament || '',
      };
      
      if (data.age) {
        const today = new Date();
        const birthYear = today.getFullYear() - data.age;
        const approximateBirthDate = new Date(birthYear, 0, 1);
        transformedData.date_of_birth = approximateBirthDate.toISOString().split('T')[0];
      }
      
      // If there's a photo file, first upload it and get the URL
      if (petPhotoFile) {
        try {
          console.log('Uploading pet photo before creating pet record');
          
          // Create a temporary pet ID for the upload
          const tempPetId = `temp_${Date.now()}`;
          const imageUrl = await uploadProfilePicture(tempPetId, petPhotoFile);
          
          if (imageUrl) {
            console.log('Photo uploaded successfully:', imageUrl);
            transformedData.profile_picture_url = imageUrl;
          } else {
            console.warn('Failed to upload photo, proceeding without it');
          }
        } catch (uploadError) {
          console.error('Error uploading photo:', uploadError);
          toast.error('No se pudo subir la foto, pero se guardará la mascota sin imagen');
        }
      }
      
      console.log('Submitting pet data:', transformedData);
      
      // Create the pet with the transformed data (including photo URL if available)
      const result = await onSubmit(transformedData);
      
      if (!result) {
        toast.error('No se pudo guardar la mascota. Revisa que todos los campos estén bien y que la imagen se haya cargado correctamente.');
        return null;
      }
      
      console.log('Pet created successfully:', result);
      
      // If we had uploaded a photo with a temp ID, update it to use the real pet ID
      if (petPhotoFile && transformedData.profile_picture_url && result.id) {
        try {
          console.log('Updating photo path for real pet ID:', result.id);
          const finalImageUrl = await uploadProfilePicture(result.id, petPhotoFile);
          
          if (finalImageUrl) {
            console.log('Final profile picture uploaded successfully:', finalImageUrl);
            result.profile_picture_url = finalImageUrl;
          }
        } catch (uploadError) {
          console.error('Error updating photo with real pet ID:', uploadError);
          // Don't fail the whole operation for this
        }
      }
      
      setCreatedPet(result);
      setStep('medical');
      return result;
      
    } catch (error) {
      console.error('Error submitting pet data:', error);
      toast.error('No se pudo guardar la mascota. Revisa que todos los campos estén bien y que la imagen se haya cargado correctamente.');
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // If we're on the medical step, render the medical form
  if (step === 'medical' && createdPet) {
    return <FormSteps step={step} createdPet={createdPet} onComplete={onCancel || (() => {})} />;
  }

  const isFormSubmitting = isSubmitting || isUploadingPhoto;

  return (
    <ScrollArea className="max-h-[70vh] pr-4 overflow-y-auto">
      <form onSubmit={handleSubmit(processFormData)} className="space-y-4 pb-4">
        <PetPhotoUpload
          photoPreview={petPhotoPreview}
          onPhotoSelect={handlePetPhotoSelect}
        />

        <PetBasicInfo
          control={control}
          register={register}
          errors={errors}
          selectedSpecies={selectedSpecies}
        />
        
        <NotesSection register={register} />
        
        <FormActionButtons 
          isSubmitting={isFormSubmitting} 
          onCancel={onCancel}
        />
      </form>
    </ScrollArea>
  );
};

export default PetForm;
