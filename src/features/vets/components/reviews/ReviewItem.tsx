
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star } from 'lucide-react';

interface ReviewItemProps {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  display_name: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  rating,
  comment,
  created_at,
  display_name
}) => {
  // Format relative date (e.g., "hace 2 días")
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es
      });
    } catch (e) {
      return 'Fecha desconocida';
    }
  };

  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="flex justify-between">
        <span className="font-medium">{display_name}</span>
        <span className="text-gray-500 text-sm">{formatDate(created_at)}</span>
      </div>
      <div className="flex my-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {comment && <p className="text-gray-700 mt-1">{comment}</p>}
    </div>
  );
};

export default ReviewItem;
