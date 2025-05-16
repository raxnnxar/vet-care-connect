
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useVetDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVetDetails = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('veterinarians')
          .select(`
            id,
            specialization,
            profile_image_url,
            average_rating,
            total_reviews,
            bio,
            animals_treated,
            education,
            certifications,
            services_offered,
            license_number,
            service_providers (
              business_name,
              provider_type,
              profiles (
                display_name,
                email
              )
            )
          `)
          .eq('id', id)
          .maybeSingle();

        if (error) throw error;
        
        // Ensure services_offered is an array
        if (data) {
          data.services_offered = Array.isArray(data.services_offered) 
            ? data.services_offered 
            : [];
        }
        
        setData(data);
      } catch (error) {
        console.error('Error fetching veterinarian details:', error);
        setError('No se pudo cargar la información del veterinario');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVetDetails();
    }
  }, [id]);

  const handleBookAppointment = () => {
    if (!id) return;
    navigate(`/owner/appointments/book/${id}`);
  };

  const handleReviewClick = () => {
    if (!id) return;
    navigate(`/owner/vets/${id}/review`);
  };

  return {
    data,
    loading,
    error,
    handleBookAppointment,
    handleReviewClick
  };
};
