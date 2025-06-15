import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useGroomingReviewForm = (groomingId: string) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [existingReview, setExistingReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id || !groomingId) {
      setLoading(false);
      return;
    }

    const fetchExistingReview = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('grooming_id', groomingId)
          .eq('pet_owner_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching existing review:', error);
          return;
        }

        if (data) {
          setExistingReview(data);
          setRating(data.rating);
          setComment(data.comment || '');
        }
      } catch (err) {
        console.error('Error checking for existing review:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingReview();
  }, [user?.id, groomingId]);

  const submitReview = async () => {
    if (!user?.id || rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setSubmitting(true);

    try {
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);

        if (error) throw error;
        toast.success('Reseña actualizada exitosamente');
      } else {
        // Create new review - removed the placeholder veterinarian_id
        const { error } = await supabase
          .from('reviews')
          .insert({
            pet_owner_id: user.id,
            grooming_id: groomingId,
            veterinarian_id: null, // Set to null for grooming reviews
            rating,
            comment
          });

        if (error) throw error;
        toast.success('Reseña enviada exitosamente');
      }

      // Update grooming ratings
      await updateGroomingRatings();
      
      // Navigate back to grooming detail using the correct route structure
      navigate(`/owner/estetica/${groomingId}`);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      toast.error('Error al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const updateGroomingRatings = async () => {
    try {
      // Get all reviews for this grooming
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('grooming_id', groomingId);

      if (error) throw error;

      if (reviews && reviews.length > 0) {
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

        // Update grooming table
        const { error: updateError } = await supabase
          .from('pet_grooming')
          .update({
            average_rating: averageRating,
            total_reviews: totalReviews,
            updated_at: new Date().toISOString()
          })
          .eq('id', groomingId);

        if (updateError) throw updateError;
      }
    } catch (err) {
      console.error('Error updating grooming ratings:', err);
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
