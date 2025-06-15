
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Star } from 'lucide-react';
import { useGroomingReviews } from '../hooks/useGroomingReviews';
import GroomingReviewItem from '../components/reviews/GroomingReviewItem';
import ReviewsLoadingState from '@/features/vets/components/reviews/ReviewsLoadingState';
import ReviewsStateMessage from '@/features/vets/components/reviews/ReviewsStateMessage';

interface ReviewsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groomingId: string;
  onReviewClick: () => void;
}

export const ReviewsDialog: React.FC<ReviewsDialogProps> = ({
  isOpen,
  setIsOpen,
  groomingId,
  onReviewClick
}) => {
  const { reviews, loading, error } = useGroomingReviews(groomingId);

  const handleReviewClick = () => {
    setIsOpen(false);
    onReviewClick();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#79D0B8]" />
            Reseñas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <ReviewsLoadingState />
          ) : error ? (
            <ReviewsStateMessage message="Error al cargar las reseñas" />
          ) : reviews.length === 0 ? (
            <ReviewsStateMessage message="Aún no hay reseñas para esta estética" />
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <GroomingReviewItem
                  key={review.id}
                  id={review.id}
                  reviewerName={review.pet_owner.profiles.display_name}
                  rating={review.rating}
                  comment={review.comment}
                  createdAt={review.created_at}
                />
              ))}
            </div>
          )}

          <Button
            onClick={handleReviewClick}
            className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
          >
            Escribir una reseña
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
