
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Medication {
  id: string;
  medication: string;
  dosage: string;
  frequency_hours: number;
  start_date: string;
  category: 'cronico' | 'suplemento';
  source: 'owner' | 'vet';
  prescribed_by?: string;
  treatment_case_id?: string;
}

export const usePetMedications = (petId: string) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedications = async () => {
    if (!petId) return;
    
    try {
      // Fetch owner medications
      const { data: ownerMeds, error: ownerError } = await supabase
        .from('owner_medications')
        .select('*')
        .eq('pet_id', petId);

      if (ownerError) throw ownerError;

      // Fetch vet medications from active treatments
      const { data: vetMeds, error: vetError } = await supabase
        .from('v_treatment_medications')
        .select(`
          *,
          treatment_cases!inner(
            veterinarian_id,
            start_date,
            pet_id
          )
        `)
        .eq('treatment_cases.pet_id', petId)
        .eq('is_active', true);

      if (vetError) throw vetError;

      // Transform owner medications
      const transformedOwnerMeds: Medication[] = (ownerMeds || []).map(med => ({
        id: med.id,
        medication: med.medication || '',
        dosage: med.dosage || '',
        frequency_hours: med.frequency_hours || 0,
        start_date: med.start_date || '',
        category: med.category || 'cronico',
        source: 'owner' as const
      }));

      // Transform vet medications
      const transformedVetMeds: Medication[] = (vetMeds || []).map(med => ({
        id: med.id,
        medication: med.medication,
        dosage: med.dosage,
        frequency_hours: med.frequency_hours,
        start_date: med.start_date,
        category: 'cronico' as const,
        source: 'vet' as const,
        treatment_case_id: med.treatment_case_id
      }));

      setMedications([...transformedVetMeds, ...transformedOwnerMeds]);
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast.error('Error al cargar los medicamentos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [petId]);

  return {
    medications,
    isLoading,
    refetch: fetchMedications
  };
};
