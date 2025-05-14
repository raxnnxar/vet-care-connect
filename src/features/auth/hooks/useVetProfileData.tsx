
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '../types/veterinarianTypes';
import { defaultVetProfile, parseSpecializations } from '../utils/vetProfileUtils';

export const useVetProfileData = (userId: string) => {
  const [initialData, setInitialData] = useState<VeterinarianProfile | null>(null);
  const [isInitialDataLoading, setIsInitialDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = async () => {
    if (!userId) {
      setIsInitialDataLoading(false);
      setInitialData(defaultVetProfile);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Ensure that arrays are properly defined
      const profileData: VeterinarianProfile = {
        ...defaultVetProfile,
        ...data,
        // Fix: Map from specialization in database to specializations in the app model
        specializations: parseSpecializations(data.specialization),
        education: data.education || [],
        certifications: data.certifications || [],
        animals_treated: data.animals_treated || [],
        services_offered: data.services_offered || [],
        languages_spoken: data.languages_spoken || [],
        availability: data.availability || {}
      };

      console.log('Loaded profile data:', profileData);
      setInitialData(profileData);
    } catch (err: any) {
      console.error('Error loading vet profile data:', err);
      setError(err.message);
      // Still set default profile data if there's an error
      setInitialData(defaultVetProfile);
    } finally {
      setIsInitialDataLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProfileData();
  }, [userId]);

  return { 
    initialData, 
    isInitialDataLoading, 
    error, 
    defaultVetProfile,
    refreshProfileData: loadProfileData
  };
};
