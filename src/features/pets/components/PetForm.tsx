
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/ui/molecules/scroll-area';
import { Button } from '@/ui/atoms/button';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { PetFormProps } from '@/features/pets/types/PetFormProps';
import { Pet } from '@/features/pets/types';
import PetPhotoUpload from './PetPhotoUpload';
import PetBasicInfo, { speciesMapping } from './PetBasicInfo';
import PetMedicalForm from './PetMedicalForm';
import { PET_CATEGORIES, PET_GENDER } from '@/core/constants/app.constants';
import { toast } from 'sonner';

// Define the gender mapping
export const genderMapping = {
  'Macho': PET_GENDER.MALE,
  'Hembra': PET_GENDER.FEMALE,
};

interface PetFormValues {
  name: string;
  species: string;
  customSpecies?: string;
  age?: number;
  weight?: number;
  sex: string;
  temperament: string;
  additionalNotes: string;
}

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
      
      // Add the pet photo file if available
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

  if (step === 'medical' && createdPet) {
    return (
      <PetMedicalForm
        pet={createdPet}
        onComplete={onCancel}
        onSkip={onCancel}
      />
    );
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
        
        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className="font-medium text-base">
            Notas adicionales
          </Label>
          <Textarea
            id="additionalNotes"
            {...register('additionalNotes')}
            placeholder="Información adicional relevante sobre tu mascota"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="sticky bottom-0 pt-4 bg-white bg-opacity-95 mt-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 text-base font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-center"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </form>
    </ScrollArea>
  );
};

export default PetForm;
