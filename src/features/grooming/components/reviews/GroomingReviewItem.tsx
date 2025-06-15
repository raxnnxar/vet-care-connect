
import React from 'react';
import { Star } from 'lucide-react';

interface GroomingReviewItemProps {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

const GroomingReviewItem: React.FC<GroomingReviewItemProps> = ({
  reviewerName,
  rating,
  comment,
  createdAt
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{reviewerName}</h4>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
        </div>
      </div>
      
      {comment && (
        <p className="text-gray-700 mb-2">{comment}</p>
      )}
      
      <p className="text-sm text-gray-500">{formatDate(createdAt)}</p>
    </div>
  );
};

export default GroomingReviewItem;
