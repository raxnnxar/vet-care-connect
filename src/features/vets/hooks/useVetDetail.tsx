
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VetDetailData {
  id: string;
  displayName: string;
  specializations: string;
  profileImageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  licenseNumber?: string;
  bio?: string;
  yearsOfExperience?: number;
  clinicAddress?: string;
  clinicLatitude?: number;
  clinicLongitude?: number;
  emergencyServices?: boolean;
  languagesSpoken?: string[];
  servicesOffered?: any[];
  animalsTreated?: string[];
  certifications?: any[];
  education?: any[];
  availability?: Record<string, any>;
}

export const useVetDetail = (id?: string) => {
  const [data, setData] = useState<VetDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('ID de veterinario no válido');
      setLoading(false);
      return;
    }

    const fetchVetDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: vetData, error: vetError } = await supabase
          .from('veterinarians')
          .select(`
            *,
            service_providers (
              profiles (
                display_name
              ),
              business_name
            )
          `)
          .eq('id', id)
          .single();

        if (vetError) throw vetError;

        if (!vetData) {
          throw new Error('No se encontró el veterinario');
        }

        // Format specializations
        let specializationsText = 'Medicina General';
        if (Array.isArray(vetData.specialization) && vetData.specialization.length > 0) {
          const translations: Record<string, string> = {
            'cardiology': 'Cardiología',
            'dermatology': 'Dermatología', 
            'orthopedics': 'Ortopedia',
            'neurology': 'Neurología',
            'ophthalmology': 'Oftalmología',
            'oncology': 'Oncología',
            'general': 'Medicina General',
            'surgery': 'Cirugía',
            'dentistry': 'Odontología',
            'nutrition': 'Nutrición',
            'internal_medicine': 'Medicina Interna',
            'emergency': 'Emergencias',
            'rehabilitation': 'Rehabilitación',
            'exotics': 'Animales Exóticos',
          };
          
          specializationsText = vetData.specialization
            .map((spec: string) => translations[spec] || spec)
            .join(', ');
        }

        // Format the data
        const formattedData: VetDetailData = {
          id: vetData.id,
          displayName: vetData.service_providers?.profiles?.display_name || 
                      vetData.service_providers?.business_name || 
                      'Veterinario',
          specializations: specializationsText,
          profileImageUrl: vetData.profile_image_url || undefined,
          averageRating: vetData.average_rating ? Number(vetData.average_rating) : 0,
          totalReviews: vetData.total_reviews || 0,
          licenseNumber: vetData.license_number || undefined,
          bio: vetData.bio || undefined,
          yearsOfExperience: vetData.years_of_experience || undefined,
          clinicAddress: vetData.clinic_address || undefined,
          clinicLatitude: vetData.clinic_latitude || undefined,
          clinicLongitude: vetData.clinic_longitude || undefined,
          emergencyServices: vetData.emergency_services || false,
          languagesSpoken: Array.isArray(vetData.languages_spoken) ? vetData.languages_spoken : [],
          servicesOffered: Array.isArray(vetData.services_offered) ? vetData.services_offered : [],
          animalsTreated: Array.isArray(vetData.animals_treated) ? vetData.animals_treated : [],
          certifications: Array.isArray(vetData.certifications) ? vetData.certifications : [],
          education: Array.isArray(vetData.education) ? vetData.education : [],
          availability: (vetData.availability && typeof vetData.availability === 'object') 
            ? vetData.availability as Record<string, any>
            : {}
        };

        setData(formattedData);
      } catch (err: any) {
        console.error('Error fetching vet detail:', err);
        setError(err.message || 'Error al cargar los detalles del veterinario');
      } finally {
        setLoading(false);
      }
    };

    fetchVetDetail();
  }, [id]);

  const handleBookAppointment = () => {
    if (!data) return;
    
    // Navigate to appointment booking
    navigate(`/owner/appointments/book/${data.id}`);
  };

  const handleReviewClick = () => {
    if (!data) return;
    
    // Navigate to vet review screen
    navigate(`/owner/vets/${data.id}/review`);
  };

  const handleSendMessage = () => {
    if (!data) return;
    
    // TODO: Navigate to chat with vet
    toast.info('Función de mensajes próximamente');
  };

  return {
    data,
    loading,
    error,
    handleBookAppointment,
    handleReviewClick,
    handleSendMessage
  };
};
