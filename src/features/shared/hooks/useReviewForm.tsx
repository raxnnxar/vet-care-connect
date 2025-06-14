
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProviderDetails {
  providerName: string;
  providerType: string;
  profileImage: string | null;
}

export const useReviewForm = (type: 'vet' | 'grooming') => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [providerDetails, setProviderDetails] = useState<ProviderDetails>({
    providerName: '',
    providerType: '',
    profileImage: null
  });

  useEffect(() => {
    const loadProviderDetails = async () => {
      try {
        if (type === 'vet') {
          const { data, error } = await supabase
            .from('veterinarians')
            .select(`
              profile_image_url,
              specialization,
              service_providers (
                profiles (
                  display_name
                ),
                business_name
              )
            `)
            .eq('id', id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            const displayName = data.service_providers?.profiles?.display_name || 
                              data.service_providers?.business_name || 
                              'Veterinario';
            
            const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
            const vetName = `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}`;
            
            let spec = 'general';
            if (Array.isArray(data.specialization) && data.specialization.length > 0) {
              const firstSpec = data.specialization[0];
              if (typeof firstSpec === 'string') {
                spec = firstSpec;
              }
            }
            
            setProviderDetails({
              providerName: vetName,
              providerType: spec,
              profileImage: data.profile_image_url
            });
          }
        } else {
          // For grooming
          const { data, error } = await supabase
            .from('pet_grooming')
            .select('business_name, profile_image_url')
            .eq('id', id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setProviderDetails({
              providerName: data.business_name || 'Estética',
              providerType: 'Estética',
              profileImage: data.profile_image_url
            });
          }
        }
      } catch (error) {
        console.error('Error al cargar los datos del proveedor:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del proveedor",
          variant: "destructive",
        });
      }
    };
    
    if (id && type) {
      loadProviderDetails();
    }
  }, [id, type, toast]);

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

      // Prepare the review data based on type
      const reviewData: any = {
        pet_owner_id: user.id,
        rating,
        comment: comment.trim() || null
      };

      if (type === 'vet') {
        reviewData.veterinarian_id = id;
      } else {
        reviewData.grooming_id = id;
      }

      // Insert the review
      const { error } = await supabase.from('reviews').insert(reviewData);

      if (error) throw error;

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu opinión es muy importante para nosotros.",
      });

      // Navigate back to provider profile
      const basePath = type === 'vet' ? '/owner/vets' : '/owner/grooming';
      navigate(`${basePath}/${id}`);

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
    providerDetails,
    submitting,
    handleGoBack,
    handleSubmitReview
  };
};
