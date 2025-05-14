
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VetDetails {
  id: string;
  specialization: string[];
  profile_image_url?: string;
  average_rating?: number;
  total_reviews?: number;
  bio?: string;
  animals_treated?: string[];
  education?: any[];
  certifications?: any[];
  services_offered?: any[];
  service_providers?: {
    business_name?: string;
    provider_type?: string;
    profiles?: {
      display_name?: string;
      email?: string;
    };
  };
}

export const useVetDetails = (vetId: string | undefined) => {
  const [data, setData] = useState<VetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVetDetails = async () => {
      if (!vetId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('veterinarians')
          .select(`
            id,
            specialization,
            profile_image_url,
            average_rating,
            total_reviews,
            bio,
            animals_treated,
            education,
            certifications,
            services_offered,
            service_providers (
              business_name,
              provider_type,
              profiles (
                display_name,
                email
              )
            )
          `)
          .eq('id', vetId)
          .maybeSingle();

        if (error) throw error;
        
        // Ensure services_offered is an array
        if (data) {
          data.services_offered = Array.isArray(data.services_offered) 
            ? data.services_offered 
            : [];
        }
        
        setData(data);
      } catch (error) {
        console.error('Error fetching veterinarian details:', error);
        setError('No se pudo cargar la información del veterinario');
      } finally {
        setLoading(false);
      }
    };

    fetchVetDetails();
  }, [vetId]);

  return { data, loading, error };
};
