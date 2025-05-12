
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
            service_providers (
              business_name,
              provider_type,
              profiles (
                display_name,
                profile_picture_url
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
        const getInitials = (displayName?: string) => {
          if (!displayName) return '';
          
          const nameParts = displayName.split(' ');
          if (nameParts.length >= 2) {
            return `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1].charAt(0).toUpperCase()}`;
          } else if (nameParts.length === 1) {
            return nameParts[0].substring(0, 2).toUpperCase();
          }
          return '';
        };

        // Map the database data to our frontend model
        const formattedVets: Veterinarian[] = veterinarians.map(vet => {
          // Get display name from profiles through service_providers relation
          const displayName = vet.service_providers?.profiles?.display_name || vet.service_providers?.business_name || 'Sin nombre';
          
          // For firstName and lastName, we'll use parts of displayName
          let firstName = '', lastName = '';
          const nameParts = displayName.split(' ');
          if (nameParts.length >= 2) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else if (nameParts.length === 1) {
            firstName = nameParts[0];
          }
          
          // Format display name with Dr. prefix
          const fullName = firstName 
            ? `Dr${firstName.toLowerCase().endsWith('a') ? 'a' : ''}. ${displayName}`
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

          // Get image URL with fallback to profile picture
          const imageUrl = vet.profile_image_url || 
                          vet.service_providers?.profiles?.profile_picture_url || 
                          '';

          // Return the formatted vet object
          return {
            id: vet.id,
            name: fullName,
            firstName: firstName,
            lastName: lastName,
            specialization: specializations,
            imageUrl: imageUrl,
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
