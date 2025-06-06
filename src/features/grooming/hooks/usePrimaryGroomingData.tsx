
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';

interface PrimaryGroomingData {
  id: string;
  business_name: string;
  profile_image_url: string;
  services?: string[];
}

export const usePrimaryGroomingData = () => {
  const [primaryGrooming, setPrimaryGrooming] = useState<PrimaryGroomingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchPrimaryGrooming = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get the owner's primary grooming ID
        const { data: ownerData, error: ownerError } = await supabase
          .from('pet_owners')
          .select('primary_grooming_id')
          .eq('id', user.id)
          .single();
          
        if (ownerError) {
          console.error('Error fetching owner primary grooming:', ownerError);
          setPrimaryGrooming(null);
          setLoading(false);
          return;
        }
        
        const groomingId = ownerData?.primary_grooming_id;
        
        if (!groomingId) {
          // No primary grooming assigned
          setPrimaryGrooming(null);
          setLoading(false);
          return;
        }
        
        // Fetch the grooming details
        const { data: groomingData, error: groomingError } = await supabase
          .from('pet_grooming')
          .select('id, business_name, profile_image_url, services_offered')
          .eq('id', groomingId)
          .single();
          
        if (groomingError) {
          console.error('Error fetching grooming data:', groomingError);
          throw new Error('No se pudo cargar la estética');
        }
        
        if (groomingData) {
          // Parse services offered
          let services: string[] = [];
          if (groomingData.services_offered) {
            try {
              if (Array.isArray(groomingData.services_offered)) {
                services = groomingData.services_offered.map(s => String(s));
              } else {
                const parsed = typeof groomingData.services_offered === 'string'
                  ? JSON.parse(groomingData.services_offered)
                  : groomingData.services_offered;
                services = Array.isArray(parsed) ? parsed.map(s => String(s)) : [];
              }
            } catch (e) {
              console.error("Error parsing services:", e);
              services = [];
            }
          }

          setPrimaryGrooming({
            id: groomingData.id,
            business_name: groomingData.business_name || 'Estética',
            profile_image_url: groomingData.profile_image_url || '',
            services: services.slice(0, 2) // Show max 2 services
          });
        } else {
          setPrimaryGrooming(null);
        }
      } catch (error) {
        console.error('Error fetching primary grooming:', error);
        setError('No se pudo cargar la estética de confianza');
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryGrooming();
  }, [user?.id]);

  return {
    primaryGrooming,
    loading,
    error,
  };
};
