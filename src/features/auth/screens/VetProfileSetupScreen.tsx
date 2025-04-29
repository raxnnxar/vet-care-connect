
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile, AvailabilitySchedule, EducationEntry, CertificationEntry, ServiceOffered } from '../types/veterinarianTypes';
import VetProfileForm from '../components/vet/VetProfileForm';
import { Json } from '@/integrations/supabase/types';

// Helper functions to safely convert JSON data to typed objects
const parseAvailability = (json: any): AvailabilitySchedule => {
  if (!json || typeof json !== 'object') return {} as AvailabilitySchedule;
  return json as AvailabilitySchedule;
};

const parseEducation = (json: any): EducationEntry[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(entry => ({
    id: String(entry?.id || ''),
    degree: String(entry?.degree || ''),
    institution: String(entry?.institution || ''),
    year: Number(entry?.year || new Date().getFullYear()),
    document_url: entry?.document_url ? String(entry.document_url) : undefined
  }));
};

const parseCertifications = (json: any): CertificationEntry[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(entry => ({
    id: String(entry?.id || ''),
    title: String(entry?.title || ''),
    organization: String(entry?.organization || ''),
    issue_date: String(entry?.issue_date || ''),
    expiry_date: entry?.expiry_date ? String(entry.expiry_date) : undefined,
    document_url: entry?.document_url ? String(entry.document_url) : undefined
  }));
};

const parseAnimals = (json: any): string[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(item => String(item || ''));
};

const parseServices = (json: any): ServiceOffered[] => {
  if (!json || !Array.isArray(json)) return [];
  return json.map(entry => ({
    id: String(entry?.id || ''),
    name: String(entry?.name || ''),
    description: String(entry?.description || '')
  }));
};

const parseLanguages = (json: any): string[] => {
  if (!json || !Array.isArray(json)) return ['spanish'];
  return json.map(item => String(item || ''));
};

const parseSpecializations = (json: any): string[] => {
  if (!json || !Array.isArray(json)) return ['general'];
  return json.map(item => String(item || ''));
};

const VetProfileSetupScreen = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [initialData, setInitialData] = useState<VeterinarianProfile | null>(null);

  // Default values for a new vet profile
  const defaultProfile: VeterinarianProfile = {
    specializations: ['general'],
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
          // Safely parse and convert JSON data from database to strongly-typed objects
          const typedProfile: VeterinarianProfile = {
            specializations: parseSpecializations(vetData.specialization),
            license_number: vetData.license_number || '',
            license_document_url: vetData.license_document_url,
            years_of_experience: vetData.years_of_experience || 0,
            bio: vetData.bio || '',
            availability: parseAvailability(vetData.availability),
            education: parseEducation(vetData.education),
            certifications: parseCertifications(vetData.certifications),
            animals_treated: parseAnimals(vetData.animals_treated),
            services_offered: parseServices(vetData.services_offered),
            profile_image_url: vetData.profile_image_url,
            languages_spoken: parseLanguages(vetData.languages_spoken),
            emergency_services: !!vetData.emergency_services
          };
          
          setInitialData(typedProfile);
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
      // Ensure all required fields have values
      const completeProfile: VeterinarianProfile = {
        ...profileData,
        // Provide defaults for required fields that might be missing
        specializations: profileData.specializations || ['general'],
        license_number: profileData.license_number || '',
        years_of_experience: profileData.years_of_experience || 0,
        bio: profileData.bio || '',
        // Ensure arrays and objects are properly initialized
        availability: profileData.availability || {},
        education: profileData.education || [],
        certifications: profileData.certifications || [],
        animals_treated: profileData.animals_treated || [],
        services_offered: profileData.services_offered || [],
        languages_spoken: profileData.languages_spoken || ['spanish'],
        emergency_services: profileData.emergency_services || false
      };

      // Update veterinarian record - convert types to match database requirements
      const { error: updateError } = await supabase
        .from('veterinarians')
        .update({
          specialization: completeProfile.specializations as any,
          license_number: completeProfile.license_number,
          license_document_url: completeProfile.license_document_url,
          years_of_experience: completeProfile.years_of_experience,
          bio: completeProfile.bio,
          availability: completeProfile.availability as any,
          education: completeProfile.education as any,
          certifications: completeProfile.certifications as any,
          animals_treated: completeProfile.animals_treated as any,
          services_offered: completeProfile.services_offered as any,
          profile_image_url: completeProfile.profile_image_url,
          languages_spoken: completeProfile.languages_spoken as any,
          emergency_services: completeProfile.emergency_services
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#79D0B8] to-[#5FBFB3] p-4">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-medium">Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#79D0B8] to-[#5FBFB3] py-8 px-4">
      <div className="container mx-auto max-w-3xl px-0">
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
