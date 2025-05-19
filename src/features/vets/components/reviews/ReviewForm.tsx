
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Textarea } from '@/ui/atoms/textarea';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(rating, comment);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">¿Cómo calificarías tu experiencia?</h2>
      
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className="p-1 focus:outline-none"
          >
            <Star
              size={36}
              className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Comparte tu opinión (opcional)</label>
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Describe tu experiencia con este veterinario..."
          className="w-full p-3 border border-gray-300 rounded-md"
          rows={5}
        />
      </div>
      
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className="w-full bg-[#79D0B8] hover:bg-[#68BBA3] text-white py-3"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
      </Button>
    </div>
  );
};

export default ReviewForm;
