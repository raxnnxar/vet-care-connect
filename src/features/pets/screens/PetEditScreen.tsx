
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Label } from '@/ui/atoms/label';
import { Card } from '@/ui/molecules/card';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import { usePets } from '@/features/pets/hooks/usePets';
import { usePetFileUploads } from '@/features/pets/hooks/usePetFileUploads';
import { Pet } from '@/features/pets/types';
import { toast } from 'sonner';
import { PET_CATEGORIES, PET_GENDER } from '@/core/constants/app.constants';

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
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<PetEditFormData>();

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const petData = await getPetById(id);
        if (petData) {
          setPet(petData);
          setPetPhotoPreview(petData.profile_picture_url || null);
          
          // Calcular edad si existe fecha de nacimiento
          let age = null;
          if (petData.date_of_birth) {
            const birthDate = new Date(petData.date_of_birth);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
          }
          
          // Mapear valores del backend al formulario
          setValue('name', petData.name || '');
          setValue('species', mapSpeciesFromDB(petData.species) || '');
          setValue('breed', petData.breed || '');
          setValue('weight', petData.weight ? Number(petData.weight) : null);
          setValue('sex', mapSexFromDB(petData.sex) || '');
          setValue('temperament', petData.temperament || '');
          setValue('additional_notes', petData.additional_notes || '');
          setValue('age', age);
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
  }, [id, getPetById, setValue, navigate]);

  const mapSpeciesFromDB = (dbSpecies: string) => {
    const speciesMapping: Record<string, string> = {
      [PET_CATEGORIES.DOG]: 'Perro',
      [PET_CATEGORIES.CAT]: 'Gato',
      [PET_CATEGORIES.BIRD]: 'Ave',
      [PET_CATEGORIES.FISH]: 'Pez',
      [PET_CATEGORIES.RABBIT]: 'Conejo',
      [PET_CATEGORIES.HAMSTER]: 'Hámster',
      [PET_CATEGORIES.OTHER]: 'Otro'
    };
    return speciesMapping[dbSpecies] || 'Otro';
  };

  const mapSpeciesToDB = (uiSpecies: string) => {
    const speciesMapping: Record<string, string> = {
      'Perro': PET_CATEGORIES.DOG,
      'Gato': PET_CATEGORIES.CAT,
      'Ave': PET_CATEGORIES.BIRD,
      'Pez': PET_CATEGORIES.FISH,
      'Conejo': PET_CATEGORIES.RABBIT,
      'Hámster': PET_CATEGORIES.HAMSTER,
      'Otro': PET_CATEGORIES.OTHER
    };
    return speciesMapping[uiSpecies] || PET_CATEGORIES.OTHER;
  };

  const mapSexFromDB = (dbSex: string) => {
    const sexMapping: Record<string, string> = {
      [PET_GENDER.MALE]: 'Macho',
      [PET_GENDER.FEMALE]: 'Hembra'
    };
    return sexMapping[dbSex] || '';
  };

  const mapSexToDB = (uiSex: string) => {
    const sexMapping: Record<string, string> = {
      'Macho': PET_GENDER.MALE,
      'Hembra': PET_GENDER.FEMALE
    };
    return sexMapping[uiSex] || null;
  };

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

  const onSubmit = async (data: PetEditFormData) => {
    if (!pet || !id) return;
    
    setIsSaving(true);
    setIsUploadingPhoto(true);
    
    try {
      // Preparar datos para actualización
      const updateData: any = {
        name: data.name,
        species: mapSpeciesToDB(data.species),
        breed: data.breed || null,
        weight: data.weight || null,
        sex: mapSexToDB(data.sex),
        temperament: data.temperament || '',
        additional_notes: data.additional_notes || ''
      };

      // Calcular fecha de nacimiento si se proporcionó edad
      if (data.age) {
        const today = new Date();
        const birthYear = today.getFullYear() - data.age;
        const approximateBirthDate = new Date(birthYear, 0, 1);
        updateData.date_of_birth = approximateBirthDate.toISOString().split('T')[0];
      }

      // Actualizar datos básicos de la mascota
      const updatedPet = await updatePet(id, updateData);
      
      if (!updatedPet) {
        toast.error('Error al actualizar la mascota');
        return;
      }

      // Subir nueva foto si se seleccionó una
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Foto de perfil */}
          <Card className="p-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {petPhotoPreview ? (
                  <img 
                    src={petPhotoPreview} 
                    alt={pet.name} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-white shadow-lg">
                    <Camera size={32} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Toca la imagen para cambiar la foto de perfil
              </p>
            </div>
          </Card>

          {/* Información básica */}
          <Card className="p-4 space-y-4">
            <h3 className="font-semibold text-lg">Información básica</h3>
            
            <div>
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...register('name', { required: 'El nombre es obligatorio' })}
                className="mt-1"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="species">Especie *</Label>
                <select
                  id="species"
                  {...register('species', { required: 'La especie es obligatoria' })}
                  className="mt-1 w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Selecciona especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Pez">Pez</option>
                  <option value="Conejo">Conejo</option>
                  <option value="Hámster">Hámster</option>
                  <option value="Otro">Otro</option>
                </select>
                {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species.message}</p>}
              </div>

              <div>
                <Label htmlFor="breed">Raza</Label>
                <Input
                  id="breed"
                  {...register('breed')}
                  className="mt-1"
                  placeholder="Ej: Labrador"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Edad (años)</Label>
                <Input
                  id="age"
                  type="number"
                  {...register('age', { 
                    min: { value: 0, message: 'La edad no puede ser negativa' },
                    max: { value: 50, message: 'La edad no puede ser mayor a 50 años' }
                  })}
                  className="mt-1"
                  placeholder="Ej: 3"
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register('weight', { 
                    min: { value: 0, message: 'El peso no puede ser negativo' }
                  })}
                  className="mt-1"
                  placeholder="Ej: 15.5"
                />
                {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="sex">Sexo</Label>
              <select
                id="sex"
                {...register('sex')}
                className="mt-1 w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecciona sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div>
              <Label htmlFor="temperament">Temperamento</Label>
              <Input
                id="temperament"
                {...register('temperament')}
                className="mt-1"
                placeholder="Ej: Tranquilo, juguetón"
              />
            </div>

            <div>
              <Label htmlFor="additional_notes">Notas adicionales</Label>
              <Textarea
                id="additional_notes"
                {...register('additional_notes')}
                className="mt-1"
                placeholder="Información adicional sobre tu mascota..."
                rows={3}
              />
            </div>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={goBack}
              disabled={isFormSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#79D0B8] hover:bg-[#5FBFB3]"
              disabled={isFormSubmitting || !isDirty}
            >
              {isFormSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  Guardar cambios
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </LayoutBase>
  );
};

export default PetEditScreen;
