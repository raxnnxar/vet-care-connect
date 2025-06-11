
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

export const useVetDetail = (id: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchVetDetail = async () => {
      if (!id) {
        setError('ID de veterinario no especificado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: vetData, error: vetError } = await supabase
          .from('veterinarians')
          .select(`
            *,
            service_providers (
              profiles (
                display_name,
                email
              ),
              business_name,
              provider_type
            )
          `)
          .eq('id', id)
          .single();

        if (vetError) {
          console.error('Error fetching vet:', vetError);
          setError('Error al cargar los datos del veterinario');
          return;
        }

        if (!vetData) {
          setError('Veterinario no encontrado');
          return;
        }

        // Debug: Log location data specifically
        console.log('Vet location data:', {
          clinic_address: vetData.clinic_address,
          clinic_latitude: vetData.clinic_latitude,
          clinic_longitude: vetData.clinic_longitude
        });

        setData(vetData);
      } catch (err: any) {
        console.error('Error en useVetDetail:', err);
        setError('Error inesperado al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchVetDetail();
  }, [id]);

  const handleBookAppointment = () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    navigate(`/owner/appointments/book/${id}`);
  };

  const handleReviewClick = () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    navigate('/vet-review', { state: { veterinarianId: id } });
  };

  const handleSendMessage = () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    console.log('Enviando mensaje al veterinario:', id);
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
