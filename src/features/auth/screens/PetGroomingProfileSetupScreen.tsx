
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { GroomingProfile } from '../types/groomingTypes';
import GroomingProfileImageSection from '../components/grooming/GroomingProfileImageSection';
import GroomingAvailabilitySection from '../components/grooming/GroomingAvailabilitySection';
import AnimalsAcceptedSection from '../components/grooming/AnimalsAcceptedSection';
import ServicesOfferedSection from '../components/grooming/ServicesOfferedSection';
import { ROUTES } from '@/frontend/shared/constants/routes';

const PetGroomingProfileSetupScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    register,
  } = useForm<GroomingProfile>({
    defaultValues: {
      business_name: '',
      profile_image_url: '',
      animals_accepted: ['perro'],
      availability: {},
      services_offered: [],
    },
  });

  const profileImageUrl = watch('profile_image_url');

  const onSubmit = async (data: GroomingProfile) => {
    if (!user?.id) {
      toast.error('Usuario no autenticado');
      return;
    }

    // Validar que al menos un servicio esté definido
    if (data.services_offered.length === 0) {
      toast.error('Debes agregar al menos un servicio');
      return;
    }

    // Validar que al menos un día tenga horario definido
    const hasAvailability = Object.values(data.availability).some(
      (day: any) => day.isAvailable && day.startTime && day.endTime
    );
    
    if (!hasAvailability) {
      toast.error('Debes definir al menos un horario de disponibilidad');
      return;
    }

    setIsLoading(true);

    try {
      // Guardar en la tabla pet_grooming - casting data to Json type for Supabase
      const { error } = await supabase
        .from('pet_grooming')
        .upsert({
          id: user.id,
          business_name: data.business_name,
          profile_image_url: data.profile_image_url || null,
          animals_accepted: data.animals_accepted as any,
          availability: data.availability as any,
          services_offered: data.services_offered as any,
        });

      if (error) {
        throw error;
      }

      toast.success('Perfil de grooming guardado exitosamente');
      
      // Redirigir a la pantalla de ubicación
      navigate(ROUTES.GROOMING_LOCATION_SETUP);
      
    } catch (error: any) {
      console.error('Error saving grooming profile:', error);
      toast.error('Error al guardar el perfil: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#79D0B8] to-[#4DA6A8] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#79D0B8] px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Configuración del Perfil de Estética
          </h1>
          <p className="text-white/90">
            Completa tu perfil para que los dueños de mascotas puedan encontrarte
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          {/* Imagen de perfil */}
          <GroomingProfileImageSection
            control={control}
            errors={errors}
            profileImageUrl={profileImageUrl}
            setProfileImageFile={setProfileImageFile}
            setValue={setValue}
            userId={user?.id || ''}
          />

          {/* Nombre del negocio */}
          <div className="space-y-2">
            <Label htmlFor="business_name" className="text-lg font-semibold text-gray-900">
              Nombre del negocio
            </Label>
            <Input
              id="business_name"
              {...register('business_name', {
                required: 'El nombre del negocio es requerido',
              })}
              placeholder="Ej. Estética Canina Paticlín"
              className="text-base"
            />
            {errors.business_name && (
              <p className="text-sm text-red-600">{errors.business_name.message}</p>
            )}
          </div>

          {/* Animales aceptados */}
          <AnimalsAcceptedSection control={control} errors={errors} />

          {/* Disponibilidad */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Horarios de disponibilidad
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Establece tu horario de atención para que los clientes puedan programar citas
            </p>
            <GroomingAvailabilitySection control={control} errors={errors} setValue={setValue} />
          </div>

          {/* Servicios ofrecidos */}
          <ServicesOfferedSection control={control} errors={errors} />

          {/* Botón de guardar */}
          <div className="pt-6 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#79D0B8] hover:bg-[#4DA6A8] text-white py-3 text-lg font-semibold"
            >
              {isLoading ? 'Guardando...' : 'Guardar y continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetGroomingProfileSetupScreen;
