
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GroomingBusiness } from './useGroomingData';

export const usePrimaryGroomingData = (selectedPetId?: string) => {
  const [primaryGrooming, setPrimaryGrooming] = useState<GroomingBusiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrimaryGrooming = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!selectedPetId) {
          setPrimaryGrooming(null);
          return;
        }

        // First, get the pet's primary grooming ID
        const { data: petData, error: petError } = await supabase
          .from('pets')
          .select('primary_grooming_id')
          .eq('id', selectedPetId)
          .maybeSingle();

        if (petError) {
          throw petError;
        }

        if (!petData?.primary_grooming_id) {
          setPrimaryGrooming(null);
          return;
        }

        // Then fetch the primary grooming business details
        const { data: groomingData, error: groomingError } = await supabase
          .from('pet_grooming')
          .select('*')
          .eq('id', petData.primary_grooming_id)
          .maybeSingle();

        if (groomingError) {
          throw groomingError;
        }

        if (groomingData) {
          // Format the grooming data similar to useGroomingData
          let animalsAccepted: string[] = [];
          if (groomingData.animals_accepted) {
            try {
              if (Array.isArray(groomingData.animals_accepted)) {
                animalsAccepted = groomingData.animals_accepted.map(a => String(a));
              } else {
                const parsed = typeof groomingData.animals_accepted === 'string'
                  ? JSON.parse(groomingData.animals_accepted)
                  : groomingData.animals_accepted;
                animalsAccepted = Array.isArray(parsed) ? parsed.map(a => String(a)) : [];
              }
            } catch (e) {
              console.error("Error parsing animals accepted:", e);
              animalsAccepted = [];
            }
          }

          let servicesOffered: any[] = [];
          if (groomingData.services_offered) {
            try {
              if (Array.isArray(groomingData.services_offered)) {
                servicesOffered = groomingData.services_offered;
              } else {
                const parsed = typeof groomingData.services_offered === 'string'
                  ? JSON.parse(groomingData.services_offered)
                  : groomingData.services_offered;
                servicesOffered = Array.isArray(parsed) ? parsed : [];
              }
            } catch (e) {
              console.error("Error parsing services offered:", e);
              servicesOffered = [];
            }
          }

          const formattedGrooming: GroomingBusiness = {
            id: groomingData.id,
            business_name: groomingData.business_name || 'Estética Sin Nombre',
            profile_image_url: groomingData.profile_image_url || '',
            animals_accepted: animalsAccepted,
            services_offered: servicesOffered,
            location: groomingData.location || '',
            latitude: groomingData.latitude || 0,
            longitude: groomingData.longitude || 0,
            distance: "Calculando...", // Distance will be calculated by the main hook
            rating: 4.5, // Mock rating data
            reviewCount: 12 // Mock review count
          };

          setPrimaryGrooming(formattedGrooming);
        } else {
          setPrimaryGrooming(null);
        }
      } catch (error) {
        console.error('Error fetching primary grooming:', error);
        setError('No se pudo cargar la estética de confianza');
        setPrimaryGrooming(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryGrooming();
  }, [selectedPetId]);

  return { primaryGrooming, loading, error };
};
