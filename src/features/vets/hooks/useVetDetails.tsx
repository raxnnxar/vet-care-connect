
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
        
        if (data) {
          // Ensure all JSON fields are properly converted to the expected types
          const formattedData: VetDetails = {
            id: data.id,
            // Convert specialization from Json to string[]
            specialization: Array.isArray(data.specialization) 
              ? data.specialization as string[] 
              : [],
            profile_image_url: data.profile_image_url,
            average_rating: data.average_rating,
            total_reviews: data.total_reviews,
            bio: data.bio,
            // Convert animals_treated from Json to string[]
            animals_treated: Array.isArray(data.animals_treated) 
              ? data.animals_treated as string[] 
              : [],
            // Ensure these are arrays
            education: Array.isArray(data.education) ? data.education : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            services_offered: Array.isArray(data.services_offered) 
              ? data.services_offered 
              : [],
            service_providers: data.service_providers
          };
          
          setData(formattedData);
        }
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
