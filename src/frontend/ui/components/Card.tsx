
import React from 'react';
import { cn } from '../../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow p-4 border border-gray-100', 
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
