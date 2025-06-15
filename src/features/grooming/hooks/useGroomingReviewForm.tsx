
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RootState } from '@/state/store';

export const useGroomingReviewForm = (groomingId: string) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingReview, setExistingReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Check if user has already reviewed this grooming
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!user?.id || !groomingId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('grooming_id', groomingId)
          .eq('pet_owner_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setExistingReview(data);
          setRating(data.rating);
          setComment(data.comment || '');
        }
      } catch (error: any) {
        console.error('Error checking existing review:', error);
        toast.error('Error al verificar reseña existente');
      } finally {
        setLoading(false);
      }
    };

    checkExistingReview();
  }, [user?.id, groomingId]);

  const submitReview = async () => {
    if (!user?.id || !groomingId || rating === 0) {
      toast.error('Por favor, selecciona una calificación');
      return;
    }

    try {
      setSubmitting(true);

      const reviewData = {
        pet_owner_id: user.id,
        grooming_id: groomingId,
        rating,
        comment: comment.trim() || null,
        veterinarian_id: '00000000-0000-0000-0000-000000000000' // Required field, using placeholder
      };

      let result;
      if (existingReview) {
        // Update existing review
        result = await supabase
          .from('reviews')
          .update({
            rating,
            comment: comment.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);
      } else {
        // Create new review
        result = await supabase
          .from('reviews')
          .insert(reviewData);
      }

      if (result.error) throw result.error;

      toast.success(existingReview ? 'Reseña actualizada exitosamente' : 'Reseña enviada exitosamente');
      navigate(-1);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error('Error al enviar la reseña. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    rating,
    setRating,
    comment,
    setComment,
    existingReview,
    loading,
    submitting,
    submitReview
  };
};
