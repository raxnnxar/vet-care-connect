
import React from 'react';
import { Star, MapPin, Scissors } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { GroomingBusiness } from '../hooks/useGroomingData';

interface GroomingCardProps {
  grooming: GroomingBusiness;
  onClick: (groomingId: string) => void;
}

const GroomingCard: React.FC<GroomingCardProps> = ({ grooming, onClick }) => {
  // Format animals accepted
  const formatAnimalsAccepted = () => {
    if (!grooming.animals_accepted || grooming.animals_accepted.length === 0) {
      return "Acepta: Animales domésticos";
    }
    
    if (grooming.animals_accepted.length <= 2) {
      return `Acepta: ${grooming.animals_accepted.join(', ')}`;
    }
    
    return `Acepta: ${grooming.animals_accepted[0]}, ${grooming.animals_accepted[1]} +${grooming.animals_accepted.length - 2}`;
  };

  // Format services offered
  const formatServices = () => {
    if (!grooming.services_offered || grooming.services_offered.length === 0) {
      return "ESTÉTICA CANINA";
    }
    
    const serviceNames = grooming.services_offered.map(service => {
      if (typeof service === 'string') return service;
      if (service && typeof service === 'object' && service.name) return service.name;
      return 'Servicio';
    });
    
    const primary = serviceNames[0]?.toUpperCase() || 'ESTÉTICA CANINA';
    
    if (serviceNames.length > 1) {
      return `${primary} +${serviceNames.length - 1}`;
    }
    
    return primary;
  };
  
  return (
    <Card 
      key={grooming.id}
      className="p-4 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow rounded-xl relative overflow-hidden border border-gray-200"
      onClick={() => onClick(grooming.id)}
    >
      <Avatar className="h-16 w-16 mr-3 shadow-sm">
        {grooming.profile_image_url ? (
          <AvatarImage src={grooming.profile_image_url} alt={grooming.business_name} className="object-cover" />
        ) : (
          <AvatarFallback className="bg-[#79D0B8] text-white">
            <Scissors className="w-8 h-8" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <h3 className="font-medium text-[#1F2937] text-base">{grooming.business_name}</h3>
        <p className="text-sm text-gray-500 font-medium">{formatServices()}</p>
        <p className="text-xs text-gray-500 mt-0.5">{formatAnimalsAccepted()}</p>
        <div className="flex items-center mt-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="ml-1 text-sm font-medium">{grooming.rating?.toFixed(1) || '5.0'}</span>
          <span className="ml-1 text-xs text-gray-500">({grooming.reviewCount || 0} reseñas)</span>
          <div className="ml-auto flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {grooming.distance || '0.0 km'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroomingCard;
