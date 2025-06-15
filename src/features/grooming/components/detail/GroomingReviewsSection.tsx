
import React from 'react';
import { Star } from 'lucide-react';
import { useGroomingReviews } from '../../hooks/useGroomingReviews';
import ReviewItem from '@/features/vets/components/reviews/ReviewItem';
import ReviewsLoadingState from '@/features/vets/components/reviews/ReviewsLoadingState';
import ReviewsStateMessage from '@/features/vets/components/reviews/ReviewsStateMessage';

interface GroomingReviewsSectionProps {
  groomingId: string;
  averageRating?: number;
  totalReviews?: number;
}

const GroomingReviewsSection: React.FC<GroomingReviewsSectionProps> = ({
  groomingId,
  averageRating = 0,
  totalReviews = 0
}) => {
  const { reviews, loading, error } = useGroomingReviews(groomingId);

  if (loading) {
    return <ReviewsLoadingState />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-[#79D0B8]" />
          Reseñas
        </h3>
        <ReviewsStateMessage 
          message="Error al cargar las reseñas" 
          type="error" 
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Star className="w-5 h-5 mr-2 text-[#79D0B8]" />
          Reseñas ({totalReviews})
        </h3>
        
        {totalReviews > 0 && (
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
            <span className="font-medium">{Number(averageRating).toFixed(1)}</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <ReviewsStateMessage 
          message="Aún no hay reseñas para esta estética" 
          type="empty" 
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={{
                id: review.id,
                pet_owner_id: review.pet_owner_id,
                veterinarian_id: '', // Not used for grooming
                rating: review.rating,
                comment: review.comment,
                created_at: review.created_at,
                updated_at: review.updated_at,
                pet_owner: review.pet_owner
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroomingReviewsSection;
