
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '../types/veterinarianTypes';
import VetProfileForm from '../components/vet/VetProfileForm';
import { v4 as uuidv4 } from 'uuid';

const VetProfileSetupScreen = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<VeterinarianProfile> | null>(null);

  // Default values for a new vet profile
  const defaultProfile: VeterinarianProfile = {
    specialization: 'general',
    license_number: '',
    years_of_experience: 0,
    bio: '',
    availability: {},
    education: [],
    certifications: [],
    animals_treated: [],
    services_offered: [],
    languages_spoken: ['spanish'],
    emergency_services: false
  };

  useEffect(() => {
    if (!user?.id) {
      toast.error('No se pudo identificar al usuario. Vuelve a iniciar sesión.');
      navigate(ROUTES.LOGIN);
      return;
    }

    const fetchVetProfile = async () => {
      try {
        setIsInitialDataLoading(true);
        
        // Check if vet record exists
        const { data: vetData, error: vetError } = await supabase
          .from('veterinarians')
          .select('*')
          .eq('id', user.id)
          .single();

        if (vetError && vetError.code !== 'PGRST116') {
          console.error('Error fetching veterinarian data:', vetError);
          toast.error('Error al cargar los datos del perfil');
        }

        if (vetData) {
          setInitialData({
            ...vetData,
            availability: vetData.availability || {},
            education: vetData.education || [],
            certifications: vetData.certifications || [],
            animals_treated: vetData.animals_treated || [],
            services_offered: vetData.services_offered || [],
            languages_spoken: vetData.languages_spoken || ['spanish']
          });
        } else {
          // Check if the user has a service_provider record
          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('provider_type')
            .eq('id', user.id)
            .single();

          if (providerError && providerError.code !== 'PGRST116') {
            console.error('Error checking service provider:', providerError);
          }

          if (!providerData || providerData.provider_type !== 'veterinarian') {
            console.warn('User is not registered as a veterinarian.');
            // Create a veterinarian record if none exists
            const { error: createVetError } = await supabase
              .from('veterinarians')
              .insert({ id: user.id });

            if (createVetError) {
              console.error('Error creating veterinarian record:', createVetError);
              toast.error('Error al crear el registro de veterinario');
            }
          }
          
          setInitialData(defaultProfile);
        }
      } catch (error) {
        console.error('Error in fetching vet profile:', error);
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setIsInitialDataLoading(false);
      }
    };

    fetchVetProfile();
  }, [user, navigate]);

  const handleSubmit = async (profileData: VeterinarianProfile) => {
    if (!user?.id) {
      toast.error('No se pudo identificar al usuario. Vuelve a iniciar sesión.');
      return;
    }

    setIsLoading(true);

    try {
      // Update veterinarian record
      const { error: updateError } = await supabase
        .from('veterinarians')
        .update({
          specialization: profileData.specialization,
          license_number: profileData.license_number,
          license_document_url: profileData.license_document_url,
          years_of_experience: profileData.years_of_experience,
          bio: profileData.bio,
          availability: profileData.availability,
          education: profileData.education,
          certifications: profileData.certifications,
          animals_treated: profileData.animals_treated,
          services_offered: profileData.services_offered,
          profile_image_url: profileData.profile_image_url,
          languages_spoken: profileData.languages_spoken,
          emergency_services: profileData.emergency_services
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Also update the service provider record to ensure consistency
      await supabase
        .from('service_providers')
        .update({
          provider_type: 'veterinarian',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      toast.success('Perfil actualizado con éxito');
      navigate(ROUTES.VET);
    } catch (error: any) {
      console.error('Error updating vet profile:', error);
      toast.error(`Error al actualizar el perfil: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#79D0B8] p-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-medium">Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#79D0B8] py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Configura tu perfil profesional</h1>
          <p className="text-white/80 mt-2">
            Completa tu información para que los dueños de mascotas puedan encontrarte
          </p>
        </div>

        <VetProfileForm 
          initialData={initialData || defaultProfile}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          userId={user?.id || ''}
        />
      </div>
    </div>
  );
};

export default VetProfileSetupScreen;
