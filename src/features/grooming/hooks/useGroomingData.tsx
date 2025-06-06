
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GroomingBusiness {
  id: string;
  business_name: string;
  profile_image_url: string;
  animals_accepted: string[];
  services_offered: any[];
  location: string;
  latitude: number;
  longitude: number;
  distance?: string;
  rating?: number;
  reviewCount?: number;
}

export const useGroomingData = () => {
  const [groomingBusinesses, setGroomingBusinesses] = useState<GroomingBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroomingBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: groomingData, error: groomingError } = await supabase
          .from('pet_grooming')
          .select('*')
          .order('business_name');

        if (groomingError) {
          throw groomingError;
        }

        // Format the grooming data
        const formattedGrooming: GroomingBusiness[] = groomingData.map(grooming => {
          // Parse animals accepted
          let animalsAccepted: string[] = [];
          if (grooming.animals_accepted) {
            try {
              if (Array.isArray(grooming.animals_accepted)) {
                animalsAccepted = grooming.animals_accepted.map(a => String(a));
              } else {
                const parsed = typeof grooming.animals_accepted === 'string'
                  ? JSON.parse(grooming.animals_accepted)
                  : grooming.animals_accepted;
                animalsAccepted = Array.isArray(parsed) ? parsed.map(a => String(a)) : [];
              }
            } catch (e) {
              console.error("Error parsing animals accepted:", e);
              animalsAccepted = [];
            }
          }

          // Parse services offered
          let servicesOffered: any[] = [];
          if (grooming.services_offered) {
            try {
              if (Array.isArray(grooming.services_offered)) {
                servicesOffered = grooming.services_offered;
              } else {
                const parsed = typeof grooming.services_offered === 'string'
                  ? JSON.parse(grooming.services_offered)
                  : grooming.services_offered;
                servicesOffered = Array.isArray(parsed) ? parsed : [];
              }
            } catch (e) {
              console.error("Error parsing services offered:", e);
              servicesOffered = [];
            }
          }

          return {
            id: grooming.id,
            business_name: grooming.business_name || 'Estética Sin Nombre',
            profile_image_url: grooming.profile_image_url || '',
            animals_accepted: animalsAccepted,
            services_offered: servicesOffered,
            location: grooming.location || '',
            latitude: grooming.latitude || 0,
            longitude: grooming.longitude || 0,
            distance: "1.5 km", // Mock distance data
            rating: 4.5, // Mock rating data
            reviewCount: 12 // Mock review count
          };
        });

        setGroomingBusinesses(formattedGrooming);
      } catch (error) {
        console.error('Error fetching grooming businesses:', error);
        setError('No se pudieron cargar las estéticas');
      } finally {
        setLoading(false);
      }
    };

    fetchGroomingBusinesses();
  }, []);

  return { groomingBusinesses, loading, error };
};
