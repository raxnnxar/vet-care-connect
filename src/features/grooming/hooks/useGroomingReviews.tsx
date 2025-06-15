
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GroomingReview {
  id: string;
  pet_owner_id: string;
  grooming_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  pet_owner: {
    profiles: {
      display_name: string;
    };
  };
}

export const useGroomingReviews = (groomingId: string) => {
  const [reviews, setReviews] = useState<GroomingReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          pet_owner_id,
          grooming_id,
          rating,
          comment,
          created_at,
          updated_at
        `)
        .eq('grooming_id', groomingId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get pet owner profiles separately
      const petOwnerIds = (data || []).map(review => review.pet_owner_id);
      
      if (petOwnerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', petOwnerIds);

        if (profilesError) throw profilesError;

        // Transform the data to match our expected structure
        const transformedReviews = (data || []).map(review => {
          const profile = profiles?.find(p => p.id === review.pet_owner_id);
          return {
            ...review,
            pet_owner: {
              profiles: {
                display_name: profile?.display_name || 'Usuario anónimo'
              }
            }
          };
        });

        setReviews(transformedReviews);
      } else {
        setReviews([]);
      }
    } catch (err: any) {
      console.error('Error fetching grooming reviews:', err);
      setError(err.message);
      toast.error('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groomingId) {
      fetchReviews();
    }
  }, [groomingId]);

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  };
};
