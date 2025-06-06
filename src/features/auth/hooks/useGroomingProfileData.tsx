
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GroomingProfile } from '../types/groomingTypes';

export const useGroomingProfileData = (userId: string | undefined) => {
  const [initialData, setInitialData] = useState<GroomingProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroomingProfile = async () => {
      if (!userId) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('pet_grooming')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          // Safe type conversion with proper defaults
          const groomingProfile: GroomingProfile = {
            business_name: data.business_name || '',
            profile_image_url: data.profile_image_url || '',
            animals_accepted: Array.isArray(data.animals_accepted) 
              ? (data.animals_accepted as string[])
              : [],
            availability: (data.availability && typeof data.availability === 'object') 
              ? (data.availability as Record<string, any>)
              : {},
            services_offered: Array.isArray(data.services_offered) 
              ? (data.services_offered as any[])
              : []
          };

          setInitialData(groomingProfile);
        }
      } catch (err: any) {
        console.error('Error fetching grooming profile:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroomingProfile();
  }, [userId]);

  return { initialData, isLoading, error };
};
