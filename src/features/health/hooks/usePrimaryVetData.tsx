
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface PrimaryVetData {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
}

export const usePrimaryVetData = (petId?: string) => {
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
        
        let vetId: string | null = null;
        
        if (petId) {
          // If petId is provided, fetch the primary vet for that pet
          const { data: petData, error: petError } = await supabase
            .from('pets')
            .select('primary_vet_id')
            .eq('id', petId)
            .eq('owner_id', user.id)
            .single();
            
          if (petError) {
            console.error('Error fetching pet primary vet:', petError);
            throw new Error('No se pudo obtener el veterinario de la mascota');
          }
          
          vetId = petData?.primary_vet_id || null;
        } else {
          // If no petId, fallback to owner's primary vet (legacy behavior)
          const { data: ownerData, error: ownerError } = await supabase
            .from('pet_owners')
            .select('primary_vet_id')
            .eq('id', user.id)
            .single();
            
          if (ownerError) {
            console.error('Error fetching owner primary vet:', ownerError);
          } else {
            vetId = ownerData?.primary_vet_id || null;
          }
        }
        
        if (!vetId) {
          // No primary vet assigned
          setPrimaryVet(null);
          setLoading(false);
          return;
        }
        
        // Fetch the vet details
        const { data: vetData, error: vetError } = await supabase
          .from('veterinarians')
          .select(`
            id, 
            profile_image_url, 
            specialization,
            service_providers (
              business_name,
              profiles (
                display_name
              )
            )
          `)
          .eq('id', vetId)
          .single();
          
        if (vetError) {
          console.error('Error fetching veterinarian data:', vetError);
          throw new Error('No se pudo cargar el veterinario');
        }
        
        if (vetData) {
          // Format the vet data
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
  }, [user?.id, petId]);

  return {
    primaryVet,
    loading,
    error,
  };
};
