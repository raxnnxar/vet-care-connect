
import React from 'react';
import { User, Star } from 'lucide-react';

interface VetProfileHeroProps {
  displayName: string;
  specializations: string;
  profileImageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  licenseNumber?: string;
  getInitials: (name: string) => string;
  onRatingClick?: () => void;
}

const VetProfileHero: React.FC<VetProfileHeroProps> = ({
  displayName,
  specializations,
  profileImageUrl,
  averageRating = 0,
  totalReviews = 0,
  licenseNumber,
  getInitials,
  onRatingClick
}) => {
  // Format rating to display with one decimal place
  const formattedRating = Number(averageRating).toFixed(1);
  
  return (
    <div className="bg-[#79D0B8] p-6 flex flex-col items-center text-white">
      <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4 border-4 border-white">
        {profileImageUrl ? (
          <img 
            src={profileImageUrl} 
            alt={displayName}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="bg-white/20 w-full h-full flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(displayName)}
          </div>
        )}
      </div>
      
      <h1 className="text-2xl font-bold text-center">{displayName}</h1>
      <p className="text-lg mb-2">{specializations}</p>
      
      {/* Rating and reviews section - now clickable */}
      <button 
        onClick={onRatingClick}
        className="flex items-center bg-[#4DA6A8] rounded-full px-6 py-2 mt-2 cursor-pointer transition-all hover:bg-[#3D8A8C] focus:outline-none"
      >
        <span className="text-xl font-bold mr-2">{formattedRating}</span>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star}
              className={`w-5 h-5 ${Number(formattedRating) >= star ? 'fill-white text-white' : 'text-white/50'}`} 
            />
          ))}
        </div>
        <span className="ml-3">
          ({totalReviews || 0} reseñas)
        </span>
      </button>

      {/* License information */}
      {licenseNumber && (
        <div className="mt-4 text-white/90 text-sm">
          Licencia: <span className="font-medium">{licenseNumber}</span>
        </div>
      )}
    </div>
  );
};

export default VetProfileHero;
