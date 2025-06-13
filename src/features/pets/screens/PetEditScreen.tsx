
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft } from 'lucide-react';
import { usePets } from '@/features/pets/hooks/usePets';
import { usePetFileUploads } from '@/features/pets/hooks/usePetFileUploads';
import { Pet } from '@/features/pets/types';
import { toast } from 'sonner';
import PetEditForm from '@/features/pets/components/edit/PetEditForm';
import PetPhotoSection from '@/features/pets/components/edit/PetPhotoSection';
import { mapSpeciesFromDB, mapSpeciesToDB, mapSexFromDB, mapSexToDB } from '@/features/pets/utils/petDataMapping';

interface PetEditFormData {
  name: string;
  species: string;
  breed: string;
  weight: number | null;
  sex: string;
  temperament: string;
  additional_notes: string;
  age: number | null;
}

const PetEditScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPetById, updatePet } = usePets();
  const { uploadProfilePicture } = usePetFileUploads();
  
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string | null>(null);
  const [petPhotoFile, setPetPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const petData = await getPetById(id);
        if (petData) {
          setPet(petData);
          setPetPhotoPreview(petData.profile_picture_url || null);
        } else {
          toast.error('No se pudo encontrar la mascota');
          navigate('/owner/profile');
        }
      } catch (error) {
        console.error('Error fetching pet:', error);
        toast.error('Error al cargar los datos de la mascota');
        navigate('/owner/profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id, getPetById, navigate]);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPetPhotoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setPetPhotoFile(file);
    }
  };

  const prepareFormData = (pet: Pet): PetEditFormData => {
    let age = null;
    if (pet.date_of_birth) {
      const birthDate = new Date(pet.date_of_birth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
    }
    
    return {
      name: pet.name || '',
      species: mapSpeciesFromDB(pet.species) || '',
      breed: pet.breed || '',
      weight: pet.weight ? Number(pet.weight) : null,
      sex: mapSexFromDB(pet.sex) || '',
      temperament: pet.temperament || '',
      additional_notes: pet.additional_notes || '',
      age: age,
    };
  };

  const onSubmit = async (data: PetEditFormData) => {
    if (!pet || !id) return;
    
    setIsSaving(true);
    setIsUploadingPhoto(true);
    
    try {
      const updateData: any = {
        name: data.name,
        species: mapSpeciesToDB(data.species),
        breed: data.breed || null,
        weight: data.weight || null,
        sex: mapSexToDB(data.sex),
        temperament: data.temperament || '',
        additional_notes: data.additional_notes || ''
      };

      if (data.age) {
        const today = new Date();
        const birthYear = today.getFullYear() - data.age;
        const approximateBirthDate = new Date(birthYear, 0, 1);
        updateData.date_of_birth = approximateBirthDate.toISOString().split('T')[0];
      }

      const updatedPet = await updatePet(id, updateData);
      
      if (!updatedPet) {
        toast.error('Error al actualizar la mascota');
        return;
      }

      if (petPhotoFile) {
        try {
          const photoUrl = await uploadProfilePicture(id, petPhotoFile);
          if (photoUrl) {
            toast.success('Mascota y foto actualizadas exitosamente');
          } else {
            toast.success('Mascota actualizada exitosamente, pero la foto no se pudo subir');
          }
        } catch (photoError) {
          console.error('Error uploading photo:', photoError);
          toast.success('Mascota actualizada exitosamente, pero la foto no se pudo subir');
        }
      } else {
        toast.success('Mascota actualizada exitosamente');
      }

      navigate('/owner/profile');
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Error al actualizar la mascota');
    } finally {
      setIsSaving(false);
      setIsUploadingPhoto(false);
    }
  };

  const goBack = () => {
    navigate('/owner/profile');
  };

  if (isLoading) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Cargando...</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4 flex justify-center items-center h-full">
          <div className="animate-pulse flex flex-col w-full gap-4">
            <div className="h-48 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </LayoutBase>
    );
  }

  if (!pet) {
    return (
      <LayoutBase
        header={
          <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft />
            </Button>
            <h1 className="text-white font-medium text-lg ml-2">Mascota no encontrada</h1>
          </div>
        }
        footer={<NavbarInferior activeTab="profile" />}
      >
        <div className="p-4">
          <Card className="p-4 text-center">
            <p>No se pudo encontrar la información de esta mascota.</p>
            <Button className="mt-4 bg-[#79D0B8]" onClick={goBack}>
              Volver al perfil
            </Button>
          </Card>
        </div>
      </LayoutBase>
    );
  }

  const isFormSubmitting = isSaving || isUploadingPhoto;
  const initialFormData = prepareFormData(pet);

  return (
    <LayoutBase
      header={
        <div className="flex items-center px-4 py-3 bg-[#79D0B8]">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft />
          </Button>
          <h1 className="text-white font-medium text-lg ml-2">Editar {pet.name}</h1>
        </div>
      }
      footer={<NavbarInferior activeTab="profile" />}
    >
      <div className="p-4 pb-20">
        <PetPhotoSection
          petName={pet.name}
          photoPreview={petPhotoPreview}
          onPhotoSelect={handlePhotoSelect}
        />
        
        <div className="mt-6">
          <PetEditForm
            initialData={initialFormData}
            onSubmit={onSubmit}
            isSubmitting={isFormSubmitting}
            onCancel={goBack}
          />
        </div>
      </div>
    </LayoutBase>
  );
};

export default PetEditScreen;
