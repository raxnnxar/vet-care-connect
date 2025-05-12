
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Veterinarian {
  id: string;
  name: string;
  specialization: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
}

export const useVeterinariansData = () => {
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVeterinarians = async () => {
      try {
        setLoading(true);
        setError(null);

        // Update the query to join with profiles table properly
        const { data: veterinarians, error: vetError } = await supabase
          .from('veterinarians')
          .select(`
            *,
            profiles:id(
              display_name
            )
          `);

        if (vetError) {
          throw vetError;
        }

        // Map the database data to our frontend model
        const formattedVets: Veterinarian[] = veterinarians.map(vet => {
          // Safely handle potentially null profile
          let displayName = "Dr. Veterinario";
          
          // Check if profiles exists and has display_name
          if (vet.profiles && typeof vet.profiles === 'object') {
            // Use optional chaining to safely access display_name
            const profiles = vet.profiles as Record<string, any>;
            if ('display_name' in profiles) {
              displayName = String(profiles.display_name || '');
            }
          }
          
          // Parse specializations - ensure it's an array
          let specializations: string[] = [];
          if (vet.specialization) {
            try {
              // Handle if specialization is already an array
              if (Array.isArray(vet.specialization)) {
                specializations = vet.specialization.map(s => String(s));
              } else {
                // Try to parse as JSON if it's a string
                const parsed = typeof vet.specialization === 'string' 
                  ? JSON.parse(vet.specialization) 
                  : vet.specialization;
                specializations = Array.isArray(parsed) ? parsed.map(s => String(s)) : [];
              }
            } catch (e) {
              console.error("Error parsing specializations:", e);
              specializations = [];
            }
          }

          // Return the formatted vet object
          return {
            id: vet.id,
            name: displayName,
            specialization: specializations,
            imageUrl: vet.profile_image_url || 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: vet.average_rating || 0,
            reviewCount: vet.total_reviews || 0,
            distance: "1.2 km" // This is mocked for now, would need geolocation data
          };
        });

        setVets(formattedVets);
      } catch (error) {
        console.error('Error fetching veterinarians:', error);
        setError('No se pudieron cargar los veterinarios');
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarians();
  }, []);

  return { vets, loading, error };
};
