
import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';

interface VetProfileHeaderProps {
  data: any;
  displayName: string;
  specializations: string;
  getInitials: (name: string) => string;
}

const VetProfileHeader: React.FC<VetProfileHeaderProps> = ({
  data,
  displayName,
  specializations,
  getInitials,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            {data.profile_image_url ? (
              <AvatarImage src={data.profile_image_url} alt={displayName} />
            ) : (
              <AvatarFallback className="bg-[#79D0B8] text-white">
                {getInitials(displayName)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-gray-600">{specializations}</p>
            
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(data.average_rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">
                {(data.average_rating || 0).toFixed(1)}
              </span>
              <span className="ml-1 text-sm text-gray-500">
                ({data.total_reviews || 0} reseñas)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VetProfileHeader;
