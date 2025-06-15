
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GroomingDetailData {
  id: string;
  business_name: string;
  profile_image_url?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  animals_accepted: string[];
  services_offered: any[];
  availability: Record<string, any>;
  average_rating?: number;
  total_reviews?: number;
}

export const useGroomingDetail = (id?: string) => {
  const [data, setData] = useState<GroomingDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('ID de estética no válido');
      setLoading(false);
      return;
    }

    const fetchGroomingDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: groomingData, error: groomingError } = await supabase
          .from('pet_grooming')
          .select('*')
          .eq('id', id)
          .single();

        if (groomingError) throw groomingError;

        if (!groomingData) {
          throw new Error('No se encontró la estética');
        }

        // Format the data
        const formattedData: GroomingDetailData = {
          id: groomingData.id,
          business_name: groomingData.business_name || 'Estética sin nombre',
          profile_image_url: groomingData.profile_image_url || undefined,
          location: groomingData.location || undefined,
          latitude: groomingData.latitude ? Number(groomingData.latitude) : undefined,
          longitude: groomingData.longitude ? Number(groomingData.longitude) : undefined,
          animals_accepted: Array.isArray(groomingData.animals_accepted) 
            ? groomingData.animals_accepted as string[]
            : [],
          services_offered: Array.isArray(groomingData.services_offered) 
            ? groomingData.services_offered as any[]
            : [],
          availability: (groomingData.availability && typeof groomingData.availability === 'object') 
            ? groomingData.availability as Record<string, any>
            : {},
          average_rating: groomingData.average_rating ? Number(groomingData.average_rating) : 0,
          total_reviews: groomingData.total_reviews || 0
        };

        setData(formattedData);
      } catch (err: any) {
        console.error('Error fetching grooming detail:', err);
        setError(err.message || 'Error al cargar los detalles de la estética');
      } finally {
        setLoading(false);
      }
    };

    fetchGroomingDetail();
  }, [id]);

  const handleBookAppointment = () => {
    if (!data) return;
    
    // Navigate to appointment booking with vetId parameter (BookAppointmentScreen expects vetId)
    navigate(`/owner/appointments/book/${data.id}?type=grooming`);
  };

  const handleReviewClick = () => {
    if (!data) return;
    
    // Navigate to grooming review screen
    navigate(`/owner/grooming/${data.id}/review`);
  };

  const handleSendMessage = () => {
    if (!data) return;
    
    // TODO: Navigate to chat with groomer
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
