
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

export const useVetReviews = (veterinarianId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Get reviews for this veterinarian
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('veterinarian_id', veterinarianId)
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

    if (veterinarianId) {
      fetchReviews();
    }
  }, [veterinarianId]);

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
