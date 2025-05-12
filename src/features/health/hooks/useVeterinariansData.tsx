
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Veterinarian {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  specialization: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
  animalsTreated: string[];
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

        // Consulta modificada para seguir la ruta de relación correcta
        const { data: veterinarians, error: vetError } = await supabase
          .from('veterinarians')
          .select(`
            id,
            specialization,
            profile_image_url,
            average_rating,
            total_reviews,
            animals_treated,
            service_providers:id (
              profiles (
                first_name,
                last_name
              )
            )
          `)
          .order('average_rating', { ascending: false });

        console.log('Datos obtenidos:', veterinarians); // Para depuración
        console.log('Error si existe:', vetError); // Para depuración

        if (vetError) {
          throw vetError;
        }

        // Helper function to get initials from name
        const getInitials = (firstName?: string, lastName?: string) => {
          const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
          const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
          return `${firstInitial}${lastInitial}`;
        };

        // Map the database data to our frontend model
        const formattedVets: Veterinarian[] = veterinarians.map(vet => {
          // Get first and last name from the profiles through service_providers relation
          const firstName = vet.service_providers?.profiles?.first_name || '';
          const lastName = vet.service_providers?.profiles?.last_name || '';
          
          // Format display name with Dr. prefix
          const fullName = firstName || lastName 
            ? `Dr${firstName.toLowerCase().endsWith('a') ? 'a' : ''}. ${firstName} ${lastName}`.trim()
            : `Dr. ${vet.id.substring(0, 5)}`;
          
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

          // Parse animals treated
          let animalsTreated: string[] = [];
          if (vet.animals_treated) {
            try {
              if (Array.isArray(vet.animals_treated)) {
                animalsTreated = vet.animals_treated.map(a => String(a));
              } else {
                const parsed = typeof vet.animals_treated === 'string'
                  ? JSON.parse(vet.animals_treated)
                  : vet.animals_treated;
                animalsTreated = Array.isArray(parsed) ? parsed.map(a => String(a)) : [];
              }
            } catch (e) {
              console.error("Error parsing animals treated:", e);
              animalsTreated = [];
            }
          }

          // Return the formatted vet object
          return {
            id: vet.id,
            name: fullName,
            firstName: firstName,
            lastName: lastName,
            specialization: specializations,
            imageUrl: vet.profile_image_url || '',
            rating: vet.average_rating || 0,
            reviewCount: vet.total_reviews || 0,
            distance: "1.2 km", // Mocked distance data
            animalsTreated: animalsTreated
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
