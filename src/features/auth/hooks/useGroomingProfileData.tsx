
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
          setInitialData(data as GroomingProfile);
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
