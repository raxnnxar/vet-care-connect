
import React from 'react';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { parseSpecializations } from '@/features/auth/utils/vetProfileUtils';
import { formatAnimalsTreated, translateSpecialization } from '../../utils/vetDetailUtils';

interface VetProfileHeaderProps {
  data: any;
  displayName: string;
  getInitials: (displayName: string) => string;
}

const VetProfileHeader: React.FC<VetProfileHeaderProps> = ({ 
  data, 
  displayName, 
  getInitials 
}) => {
  // Format specialization
  const specializations = parseSpecializations(data.specialization);
  const formattedSpecializations = specializations.map(spec => 
    translateSpecialization(String(spec))
  ).join(', ');

  // Format animals treated
  let animalsTreated: string[] = [];
  if (data.animals_treated) {
    try {
      if (Array.isArray(data.animals_treated)) {
        animalsTreated = data.animals_treated.map((a: any) => String(a));
      } else {
        const parsed = typeof data.animals_treated === 'string'
          ? JSON.parse(data.animals_treated)
          : data.animals_treated;
        animalsTreated = Array.isArray(parsed) ? parsed.map((a: any) => String(a)) : [];
      }
    } catch (e) {
      console.error("Error parsing animals treated:", e);
      animalsTreated = [];
    }
  }
  
  const formattedAnimalsTreated = formatAnimalsTreated(animalsTreated);

  return (
    <div className="p-4 flex items-center">
      <Avatar className="h-24 w-24 border-2 border-[#79D0B8]">
        {data.profile_image_url ? (
          <AvatarImage src={data.profile_image_url} alt={displayName} className="object-cover" />
        ) : (
          <AvatarFallback className="bg-[#79D0B8] text-white">
            {getInitials(displayName)}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="ml-4">
        <h2 className="text-xl font-semibold">{displayName}</h2>
        <p className="text-gray-600">{formattedSpecializations}</p>
        
        <div className="flex items-center mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= (data.average_rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="ml-1 text-sm text-gray-600">
            {data.average_rating?.toFixed(1) || "0.0"} ({data.total_reviews || 0} reseñas)
          </span>
        </div>
        
        {animalsTreated.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Trata: {formattedAnimalsTreated}
          </p>
        )}
      </div>
    </div>
  );
};

export default VetProfileHeader;
