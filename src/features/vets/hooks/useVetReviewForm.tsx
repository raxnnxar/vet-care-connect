
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { fetchVetDetails, translateSpecialization } from '../utils/reviewUtils';

interface VetDetails {
  vetName: string;
  vetSpecialty: string;
  profileImage: string | null;
}

export const useVetReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [vetDetails, setVetDetails] = useState<VetDetails>({
    vetName: '',
    vetSpecialty: '',
    profileImage: null
  });

  useEffect(() => {
    const loadVetDetails = async () => {
      try {
        const data = await fetchVetDetails(id);
        
        if (data) {
          const displayName = data.service_providers?.profiles?.display_name || 
                            data.service_providers?.business_name || 
                            'Veterinario';
          
          // Para el prefijo de género (Dr/Dra)
          const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
          const vetName = `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`;
          
          // Establecer especialidad
          let spec = 'general';
          if (Array.isArray(data.specialization) && data.specialization.length > 0) {
            // Asegurarnos de que cada elemento sea string
            const firstSpec = data.specialization[0];
            if (typeof firstSpec === 'string') {
              spec = firstSpec;
            }
          }
          
          setVetDetails({
            vetName,
            vetSpecialty: translateSpecialization(spec),
            profileImage: data.profile_image_url
          });
        }
      } catch (error) {
        console.error('Error al cargar los datos del veterinario:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del veterinario",
          variant: "destructive",
        });
      }
    };
    
    loadVetDetails();
  }, [id, toast]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Por favor selecciona una calificación",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error de autenticación",
          description: "Debes iniciar sesión para dejar una reseña",
          variant: "destructive",
        });
        return;
      }

      // Insert the review
      const { error } = await supabase.from('reviews').insert({
        veterinarian_id: id,
        pet_owner_id: user.id,
        rating,
        comment: comment.trim() || null
      });

      if (error) throw error;

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu opinión es muy importante para nosotros.",
      });

      // Navigate back to vet profile
      navigate(`/owner/vets/${id}`);

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error al enviar la reseña",
        description: "Ocurrió un error al enviar tu reseña. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    vetDetails,
    submitting,
    handleGoBack,
    handleSubmitReview
  };
};
