
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';
import { 
  VeterinarianProfile, 
  AvailabilitySchedule, 
  EducationEntry, 
  CertificationEntry, 
  ServiceOffered 
} from '../types/veterinarianTypes';
import { parseVetProfileData } from '../utils/vetProfileUtils';

// Default values for a new vet profile
export const defaultVetProfile: VeterinarianProfile = {
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

export const useVetProfileData = (userId: string | undefined) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [initialData, setInitialData] = useState<VeterinarianProfile | null>(null);

  useEffect(() => {
    if (!userId) {
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
          .eq('id', userId)
          .single();

        if (vetError && vetError.code !== 'PGRST116') {
          console.error('Error fetching veterinarian data:', vetError);
          toast.error('Error al cargar los datos del perfil');
        }

        if (vetData) {
          // Parse data from database to strongly-typed objects
          const typedProfile = parseVetProfileData(vetData);
          setInitialData(typedProfile);
        } else {
          // Check if the user has a service_provider record
          const { data: providerData, error: providerError } = await supabase
            .from('service_providers')
            .select('provider_type')
            .eq('id', userId)
            .single();

          if (providerError && providerError.code !== 'PGRST116') {
            console.error('Error checking service provider:', providerError);
          }

          if (!providerData || providerData.provider_type !== 'veterinarian') {
            console.warn('User is not registered as a veterinarian.');
            // Create a veterinarian record if none exists
            const { error: createVetError } = await supabase
              .from('veterinarians')
              .insert({ id: userId });

            if (createVetError) {
              console.error('Error creating veterinarian record:', createVetError);
              toast.error('Error al crear el registro de veterinario');
            }
          }
          
          setInitialData(defaultVetProfile);
        }
      } catch (error) {
        console.error('Error in fetching vet profile:', error);
        toast.error('Error al cargar los datos del perfil');
      } finally {
        setIsInitialDataLoading(false);
      }
    };

    fetchVetProfile();
  }, [userId, navigate]);

  return { initialData, isInitialDataLoading, defaultVetProfile };
};
