
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GroomingDetailData {
  id: string;
  business_name: string;
  profile_image_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  animals_accepted: string[];
  services_offered: any[];
  availability: Record<string, any>;
  average_rating?: number;
  total_reviews?: number;
}

export const useGroomingDetail = (groomingId: string) => {
  const [data, setData] = useState<GroomingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroomingDetail = async () => {
      if (!groomingId) {
        setLoading(false);
        return;
      }

      try {
        const { data: groomingData, error } = await supabase
          .from('pet_grooming')
          .select('*')
          .eq('id', groomingId)
          .single();

        if (error) throw error;

        if (groomingData) {
          const transformedData: GroomingDetailData = {
            id: groomingData.id,
            business_name: groomingData.business_name || 'Estética sin nombre',
            profile_image_url: groomingData.profile_image_url || undefined,
            location: groomingData.location || undefined,
            latitude: groomingData.latitude ? Number(groomingData.latitude) : undefined,
            longitude: groomingData.longitude ? Number(groomingData.longitude) : undefined,
            animals_accepted: Array.isArray(groomingData.animals_accepted) 
              ? groomingData.animals_accepted as string[]
              : [],
            services_offered: Array.isArray(groomingData.services_offered)
              ? groomingData.services_offered as any[]
              : [],
            availability: groomingData.availability && typeof groomingData.availability === 'object'
              ? groomingData.availability as Record<string, any>
              : {},
            average_rating: groomingData.average_rating ? Number(groomingData.average_rating) : 0,
            total_reviews: groomingData.total_reviews || 0
          };

          setData(transformedData);
        }
      } catch (err: any) {
        console.error('Error fetching grooming detail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroomingDetail();
  }, [groomingId]);

  return { data, loading, error };
};
