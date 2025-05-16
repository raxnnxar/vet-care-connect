
import React from 'react';

interface ReviewsStateMessageProps {
  isError?: boolean;
  message: string;
}

const ReviewsStateMessage: React.FC<ReviewsStateMessageProps> = ({
  isError = false,
  message
}) => {
  return (
    <p className={isError ? "text-red-500" : "text-gray-500 italic"}>
      {message}
    </p>
  );
};

export default ReviewsStateMessage;
