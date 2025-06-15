
import React from 'react';
import { Star, Scissors } from 'lucide-react';

interface GroomingProfileHeroProps {
  businessName: string;
  profileImageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  getInitials: (name: string) => string;
  onRatingClick: () => void;
  groomingId: string;
}

const GroomingProfileHero: React.FC<GroomingProfileHeroProps> = ({
  businessName,
  profileImageUrl,
  averageRating = 0,
  totalReviews = 0,
  getInitials,
  onRatingClick,
  groomingId
}) => {
  return (
    <div className="bg-[#79D0B8] text-white p-6 relative">
      {/* Profile Image and Basic Info */}
      <div className="flex flex-col items-center text-center space-y-4 pt-8">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-white/30 w-full h-full flex items-center justify-center text-white text-2xl font-bold">
              <Scissors className="w-12 h-12" />
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-1">{businessName}</h1>
          <p className="text-white/90 text-lg">Estética</p>
        </div>
        
        {/* Rating section - clickable */}
        <button
          onClick={onRatingClick}
          className="bg-white/20 rounded-full px-6 py-3 flex items-center space-x-2 hover:bg-white/30 transition-colors"
        >
          <span className="text-2xl font-bold">{Number(averageRating).toFixed(1)}</span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating || 0)
                    ? 'text-yellow-300 fill-current'
                    : 'text-white/50'
                }`}
              />
            ))}
          </div>
          <span className="text-white/90">({totalReviews} reseñas)</span>
        </button>
      </div>
    </div>
  );
};

export default GroomingProfileHero;
