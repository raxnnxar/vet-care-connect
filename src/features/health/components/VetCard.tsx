
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';

interface VetCardProps {
  vet: {
    id: string;
    name: string;
    specialization?: string;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    distance: string;
  };
  onClick: (vetId: string) => void;
}

const VetCard: React.FC<VetCardProps> = ({ vet, onClick }) => {
  return (
    <Card 
      key={vet.id}
      className="p-4 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow rounded-xl relative overflow-hidden border border-gray-200"
      onClick={() => onClick(vet.id)}
    >
      <Avatar className="h-16 w-16 mr-3 shadow-sm">
        <AvatarImage src={vet.imageUrl} alt={vet.name} className="object-cover" />
        <AvatarFallback className="bg-[#79D0B8] text-white">
          {vet.name.split(' ').map(name => name[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium text-[#1F2937] text-base">{vet.name}</h3>
        {vet.specialization && (
          <p className="text-sm text-gray-500">{vet.specialization}</p>
        )}
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="ml-1 text-sm font-medium">{vet.rating?.toFixed(1) || "N/A"}</span>
          <span className="ml-1 text-xs text-gray-500">({vet.reviewCount || 0} reseñas)</span>
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {vet.distance}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VetCard;
