
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/ui/molecules/card';
import { GroomingBusiness } from '../hooks/useGroomingData';

interface GroomingCardProps {
  grooming: GroomingBusiness;
  onClick: (groomingId: string) => void;
}

const GroomingCard: React.FC<GroomingCardProps> = ({
  grooming,
  onClick
}) => {
  const handleCardClick = () => {
    onClick(grooming.id);
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'NA';
    }
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
            {grooming.profile_image_url ? (
              <img 
                src={grooming.profile_image_url} 
                alt={grooming.business_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#79D0B8] flex items-center justify-center text-white font-semibold">
                {getInitials(grooming.business_name)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{grooming.business_name}</h3>
            
            {grooming.location && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="truncate">{grooming.location}</span>
              </div>
            )}
            
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium ml-1">
                  {Number(grooming.rating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({grooming.reviewCount || 0} reseñas)
                </span>
              </div>
            </div>
            
            {grooming.services_offered && grooming.services_offered.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-1">
                  {grooming.services_offered.slice(0, 2).map((service, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-[#e8f7f3] text-[#4DA6A8] text-xs px-2 py-1 rounded"
                    >
                      {typeof service === 'string' ? service : service.name || 'Servicio'}
                    </span>
                  ))}
                  {grooming.services_offered.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{grooming.services_offered.length - 2} más
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroomingCard;
