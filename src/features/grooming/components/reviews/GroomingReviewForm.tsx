import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Textarea } from '@/ui/atoms/textarea';

interface GroomingReviewFormProps {
  initialRating: number;
  initialComment: string;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isEditing: boolean;
}

const GroomingReviewForm: React.FC<GroomingReviewFormProps> = ({
  initialRating,
  initialComment,
  onRatingChange,
  onCommentChange,
  onSubmit,
  isSubmitting,
  isEditing
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        {isEditing ? 'Editar reseña' : 'Dejar reseña'}
      </h3>

      {/* Rating selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= initialRating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario (opcional)
        </label>
        <Textarea
          value={initialComment}
          onChange={(e) => onCommentChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#79D0B8] focus:border-transparent resize-none"
          rows={4}
          placeholder="Comparte tu experiencia con esta estética..."
        />
      </div>

      {/* Submit button */}
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || initialRating === 0}
        className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
      >
        {isSubmitting 
          ? 'Enviando...' 
          : isEditing 
            ? 'Actualizar reseña' 
            : 'Enviar reseña'
        }
      </Button>
    </div>
  );
};

export default GroomingReviewForm;
