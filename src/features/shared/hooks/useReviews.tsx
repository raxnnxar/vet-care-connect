
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  pet_owner_id: string;
  display_name?: string;
}

export const useReviews = (providerId: string, providerType: 'vet' | 'grooming') => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Build the filter based on provider type
        const filterField = providerType === 'vet' ? 'veterinarian_id' : 'grooming_id';
        
        // Get reviews for this provider
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq(filterField, providerId)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // If we have reviews, fetch the display names for each reviewer
        if (reviewsData && reviewsData.length > 0) {
          const reviewsWithProfiles = await Promise.all(
            reviewsData.map(async (review) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', review.pet_owner_id)
                .single();
              
              return {
                ...review,
                display_name: profileData?.display_name || 'Usuario'
              };
            })
          );

          setReviews(reviewsWithProfiles);
        } else {
          setReviews([]);
        }
      } catch (err: any) {
        console.error('Error al cargar reseñas:', err);
        setError('No se pudieron cargar las reseñas');
      } finally {
        setLoading(false);
      }
    };

    if (providerId && providerType) {
      fetchReviews();
    }
  }, [providerId, providerType]);

  const loadMoreReviews = () => {
    setPage(prev => prev + 1);
  };

  return {
    reviews,
    loading,
    error,
    page,
    loadMoreReviews
  };
};
