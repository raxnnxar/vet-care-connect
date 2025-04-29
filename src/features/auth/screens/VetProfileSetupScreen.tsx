
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile, AvailabilitySchedule, EducationEntry, CertificationEntry, ServiceOffered } from '../types/veterinarianTypes';
import VetProfileForm from '../components/vet/VetProfileForm';

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
    availability: {} as AvailabilitySchedule,
    education: [] as EducationEntry[],
    certifications: [] as CertificationEntry[],
    animals_treated: [] as string[],
    services_offered: [] as ServiceOffered[],
    languages_spoken: ['spanish'] as string[],
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
          // Convert JSON data from database to strongly-typed objects
          const availability = vetData.availability as unknown as AvailabilitySchedule || {};
          const education = Array.isArray(vetData.education) ? vetData.education as unknown as EducationEntry[] : [];
          const certifications = Array.isArray(vetData.certifications) ? vetData.certifications as unknown as CertificationEntry[] : [];
          const animals_treated = Array.isArray(vetData.animals_treated) ? vetData.animals_treated as unknown as string[] : [];
          const services_offered = Array.isArray(vetData.services_offered) ? vetData.services_offered as unknown as ServiceOffered[] : [];
          const languages_spoken = Array.isArray(vetData.languages_spoken) ? vetData.languages_spoken as unknown as string[] : ['spanish'];
          
          setInitialData({
            ...vetData,
            availability,
            education,
            certifications,
            animals_treated,
            services_offered,
            languages_spoken
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
      // Update veterinarian record - convert types to match database requirements
      const { error: updateError } = await supabase
        .from('veterinarians')
        .update({
          specialization: profileData.specialization,
          license_number: profileData.license_number,
          license_document_url: profileData.license_document_url,
          years_of_experience: profileData.years_of_experience,
          bio: profileData.bio,
          availability: profileData.availability as any,
          education: profileData.education as any,
          certifications: profileData.certifications as any,
          animals_treated: profileData.animals_treated as any,
          services_offered: profileData.services_offered as any,
          profile_image_url: profileData.profile_image_url,
          languages_spoken: profileData.languages_spoken as any,
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
