
import React, { useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrimaryVet } from '@/features/health/hooks/usePrimaryVet';
import { usePrimaryVetData } from '@/features/health/hooks/usePrimaryVetData';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/ui/molecules/tooltip';
import PetPrimaryVetDialog from './PetPrimaryVetDialog';

interface VetProfileHeroProps {
  displayName: string;
  specializations: string;
  profileImageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  licenseNumber?: string;
  getInitials: (name: string) => string;
  onRatingClick: () => void;
  vetId: string;
}

const VetProfileHero: React.FC<VetProfileHeroProps> = ({
  displayName,
  specializations,
  profileImageUrl,
  averageRating = 0,
  totalReviews = 0,
  licenseNumber,
  getInitials,
  onRatingClick,
  vetId,
}) => {
  const { loading } = usePrimaryVet(vetId, displayName);
  const { primaryVet } = usePrimaryVetData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const isPrimaryVet = primaryVet?.id === vetId;
  
  const handleSetAsPrimary = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    // Open the pet selection dialog
    setDialogOpen(true);
  };
  
  // Format rating to display with one decimal place
  const formattedRating = averageRating ? Number(averageRating).toFixed(1) : '0.0';
  
  // Calculate rating stars (filled, half, or empty)
  const renderRatingStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-white text-white" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-white/50" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="bg-[#79D0B8] pt-20 pb-6 flex flex-col items-center text-white relative">
      {/* Primary Vet Button */}
      <div className="absolute top-4 right-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleSetAsPrimary}
                disabled={loading}
                className={`bg-white/20 p-2 rounded-full transition-colors ${loading ? 'opacity-50' : 'hover:bg-white/30'}`}
              >
                <Heart 
                  size={24} 
                  className={isPrimaryVet ? "fill-white text-white" : "text-white"} 
                />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-white text-gray-800 text-xs">
              {isPrimaryVet 
                ? "Gestionar veterinario de cabecera" 
                : "Establecer como veterinario de cabecera"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4 border-4 border-white">
        {profileImageUrl ? (
          <img 
            src={profileImageUrl} 
            alt={displayName}
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl bg-[#4DA6A8]">
            {getInitials(displayName)}
          </div>
        )}
      </div>
      
      <h1 className="text-2xl font-bold mb-1 text-center">{displayName}</h1>
      
      <p className="text-sm mb-3 text-white/90">{specializations}</p>
      
      {/* Clickable rating stars */}
      <div 
        className="flex items-center bg-[#4DA6A8] rounded-full px-4 py-1 mt-1 mb-2 cursor-pointer"
        onClick={onRatingClick}
      >
        <span className="text-lg font-bold mr-2">{formattedRating}</span>
        <div className="flex">
          {renderRatingStars()}
        </div>
        <span className="ml-2 text-sm">
          ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
        </span>
      </div>

      {/* License number */}
      {licenseNumber && (
        <div className="text-white/90 text-xs mt-2">
          Licencia: <span className="font-medium">{licenseNumber}</span>
        </div>
      )}

      {/* Pet Primary Vet Dialog */}
      <PetPrimaryVetDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        vetId={vetId}
        vetName={displayName}
      />
    </div>
  );
};

export default VetProfileHero;
