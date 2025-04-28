
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

export const genderMapping = {
  'Macho': PET_GENDER.MALE,
  'Hembra': PET_GENDER.FEMALE,
};

const PetForm: React.FC<PetFormProps> = ({ mode, pet, onSubmit, isSubmitting, onCancel }) => {
  const [step, setStep] = useState<'basic' | 'medical'>('basic');
  const [createdPet, setCreatedPet] = useState<Pet | null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);

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
      const transformedData: any = {
        name: data.name,
        species: data.species === 'Otro' ? PET_CATEGORIES.OTHER : speciesMapping[data.species],
        breed: data.species === 'Otro' ? data.customSpecies : '',
        additional_notes: data.additionalNotes || '',
        weight: data.weight || null,
        sex: data.sex ? genderMapping[data.sex] : null,
        temperament: data.temperament || '',
      };
      
      if (petPhotoFile) {
        transformedData.petPhotoFile = petPhotoFile;
      }
      
      if (data.age) {
        const today = new Date();
        const birthYear = today.getFullYear() - data.age;
        const approximateBirthDate = new Date(birthYear, 0, 1);
        transformedData.date_of_birth = approximateBirthDate.toISOString().split('T')[0];
      }
      
      console.log('Submitting pet data:', transformedData);
      const result = await onSubmit(transformedData);
      if (result) {
        setCreatedPet(result);
        setStep('medical');
      }
      return result;
    } catch (error) {
      console.error('Error submitting pet data:', error);
      toast.error('Error al guardar la mascota');
      return null;
    }
  };

  // If we're on the medical step, render the medical form
  if (step === 'medical' && createdPet) {
    return <FormSteps step={step} createdPet={createdPet} onComplete={onCancel || (() => {})} />;
  }

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
          isSubmitting={isSubmitting} 
          onCancel={onCancel}
        />
      </form>
    </ScrollArea>
  );
};

export default PetForm;
