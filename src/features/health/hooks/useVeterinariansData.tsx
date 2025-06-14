
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance, getUserLocation } from '@/utils/distanceUtils';

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
  latitude?: number;
  longitude?: number;
}

export const useVeterinariansData = () => {
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Get user location on hook initialization
  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };
    fetchUserLocation();
  }, []);

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
            clinic_latitude,
            clinic_longitude,
            service_providers (
              business_name,
              provider_type,
              profiles (
                display_name
              )
            )
          `)
          .order('average_rating', { ascending: false });

        console.log('Datos obtenidos:', veterinarians);
        console.log('Error si existe:', vetError);

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

          // Calculate distance using user location and vet coordinates
          const distance = userLocation 
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                vet.clinic_latitude,
                vet.clinic_longitude
              )
            : "Calculando...";

          // Get image URL - we only have profile_image_url from veterinarians now
          const imageUrl = vet.profile_image_url || '';

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
            distance: distance,
            animalsTreated: animalsTreated,
            latitude: vet.clinic_latitude,
            longitude: vet.clinic_longitude
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
  }, [userLocation]); // Re-fetch when user location changes

  return { vets, loading, error };
};
