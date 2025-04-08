
import React from 'react';
import { Star } from 'lucide-react';
import { Veterinarian } from '../types';
import { Card } from '@/ui/molecules/card';

interface VetCardProps {
  vet: Veterinarian;
  onClick?: () => void;
}

const VetCard: React.FC<VetCardProps> = ({ vet, onClick }) => {
  return (
    <Card className="mb-4" onClick={onClick}>
      <div className="flex">
        <div className="w-20 h-20 mr-3">
          <img 
            src={vet.imageUrl} 
            alt={vet.name} 
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-lg">{vet.name}</h3>
          <div className="text-sm text-gray-500">{vet.specialization.join(', ')}</div>
          
          <div className="flex items-center mt-1">
            <Star size={16} className="text-yellow-500 fill-current" />
            <span className="text-sm ml-1 font-medium">{vet.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({vet.reviewCount})</span>
          </div>
          
          <div className="text-sm mt-1 text-gray-600">{vet.clinic}</div>
        </div>
      </div>
    </Card>
  );
};

export default VetCard;
