
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
  const [hasFetched, setHasFetched] = useState(false);

  // Get user location on hook initialization
  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (hasFetched) return; // Prevent duplicate calls

    const fetchVeterinarians = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching veterinarians from useVeterinariansData...');
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

        if (vetError) {
          console.error('Supabase error in useVeterinariansData:', vetError);
          throw vetError;
        }

        console.log('Veterinarians data fetched successfully:', veterinarians?.length || 0);

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
          const displayName = vet.service_providers?.profiles?.display_name || vet.service_providers?.business_name || 'Sin nombre';
          
          let firstName = '', lastName = '';
          const nameParts = displayName.split(' ');
          if (nameParts.length >= 2) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else if (nameParts.length === 1) {
            firstName = nameParts[0];
          }
          
          const fullName = firstName 
            ? `Dr${firstName.toLowerCase().endsWith('a') ? 'a' : ''}. ${displayName}`
            : `Dr. ${vet.id.substring(0, 5)}`;
          
          // Parse specializations
          let specializations: string[] = [];
          if (vet.specialization) {
            try {
              if (Array.isArray(vet.specialization)) {
                specializations = vet.specialization.map(s => String(s));
              } else {
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

          // Calculate distance
          const distance = userLocation 
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                vet.clinic_latitude,
                vet.clinic_longitude
              )
            : "Calculando...";

          const imageUrl = vet.profile_image_url || '';

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
        setHasFetched(true);
      } catch (error) {
        console.error('Error fetching veterinarians:', error);
        setError('No se pudieron cargar los veterinarios');
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarians();
  }, [userLocation, hasFetched]);

  return { vets, loading, error };
};
