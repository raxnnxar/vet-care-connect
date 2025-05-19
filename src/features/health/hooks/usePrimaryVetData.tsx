
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { getPrimaryVet } from '../services/primaryVetService';
import { Json } from '@/integrations/supabase/types';

interface PrimaryVetData {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
}

export const usePrimaryVetData = () => {
  const [primaryVet, setPrimaryVet] = useState<PrimaryVetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchPrimaryVet = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getPrimaryVet(user.id);
        
        if (result.success && result.data) {
          // Format the vet data
          const vetData = result.data;
          const displayName = vetData.service_providers?.profiles?.display_name || 
                             vetData.service_providers?.business_name || 
                             'Sin nombre';
          
          // For gender prefix (Dr/Dra), check if the name seems feminine (ends with 'a')
          const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
          const vetName = displayName 
            ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`.trim()
            : `Dr. ${vetData.id.substring(0, 5)}`;
          
          // Parse specialization - ensure it's converted to string
          let specialization = 'Medicina General';
          if (vetData.specialization && Array.isArray(vetData.specialization) && vetData.specialization.length > 0) {
            // Convert the first element to string regardless of its type
            specialization = String(vetData.specialization[0]);
          }
          
          setPrimaryVet({
            id: vetData.id,
            name: vetName,
            specialization: specialization,
            imageUrl: vetData.profile_image_url || ''
          });
        } else {
          // No primary vet set
          setPrimaryVet(null);
        }
      } catch (error) {
        console.error('Error fetching primary vet:', error);
        setError('No se pudo cargar el veterinario de cabecera');
      } finally {
        setLoading(false);
      }
    };

    fetchPrimaryVet();
  }, [user?.id]);

  return {
    primaryVet,
    loading,
    error,
  };
};
