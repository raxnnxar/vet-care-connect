
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '../types/veterinarianTypes';
import { Json } from '@/integrations/supabase/types';
import { 
  defaultVetProfile, 
  parseSpecializations, 
  parseEducation, 
  parseCertifications, 
  parseAnimals, 
  parseServices, 
  parseLanguages, 
  parseAvailability 
} from '../utils/vetProfileUtils';

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

      // Ensure that all data is properly parsed to the correct type
      const profileData: VeterinarianProfile = {
        ...defaultVetProfile,
        ...data,
        // Parse all JSON fields from database into appropriate types
        specializations: parseSpecializations(data.specialization),
        education: parseEducation(data.education),
        certifications: parseCertifications(data.certifications),
        animals_treated: parseAnimals(data.animals_treated),
        services_offered: parseServices(data.services_offered),
        languages_spoken: parseLanguages(data.languages_spoken),
        availability: parseAvailability(data.availability)
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
