
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ReviewItem from '@/features/vets/components/reviews/ReviewItem';
import ReviewsLoadingState from '@/features/vets/components/reviews/ReviewsLoadingState';
import ReviewsStateMessage from '@/features/vets/components/reviews/ReviewsStateMessage';
import { useReviews } from '../hooks/useReviews';

interface ReviewsSectionProps {
  providerId: string;
  providerType: 'vet' | 'grooming';
  providerName?: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  providerId, 
  providerType,
  providerName = 'proveedor'
}) => {
  const [expanded, setExpanded] = useState(false);
  const reviewsPerPage = 3;
  const { reviews, loading, error, page, loadMoreReviews } = useReviews(providerId, providerType);

  // Determine how many reviews to show based on whether it's expanded or not
  const displayedReviews = expanded 
    ? reviews.slice(0, page * reviewsPerPage) 
    : reviews.slice(0, 1);

  const hasMoreReviews = expanded && reviews.length > page * reviewsPerPage;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (loading) {
    return (
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <ReviewsLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <ReviewsStateMessage isError={true} message={error} />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
        <ReviewsStateMessage message={`Este ${providerName} aún no tiene reseñas.`} />
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Reseñas</h3>
      
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <ReviewItem 
            key={review.id}
            id={review.id}
            rating={review.rating}
            comment={review.comment}
            created_at={review.created_at}
            display_name={review.display_name || 'Usuario'}
          />
        ))}
      </div>

      {reviews.length > 1 && (
        <button 
          onClick={toggleExpanded} 
          className="mt-4 flex items-center text-[#4DA6A8] hover:text-[#3A8486] font-medium"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" /> Mostrar menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" /> Ver todas las reseñas ({reviews.length})
            </>
          )}
        </button>
      )}

      {hasMoreReviews && (
        <button 
          onClick={loadMoreReviews} 
          className="mt-2 text-[#4DA6A8] hover:text-[#3A8486] text-sm"
        >
          Cargar más reseñas
        </button>
      )}
    </div>
  );
};

export default ReviewsSection;
