
import React, { useState } from 'react';
import { Star, Heart, Scissors } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePrimaryGroomingSelection } from '../../hooks/usePrimaryGroomingSelection';
import PetPrimaryProviderDialog from '@/features/shared/components/PetPrimaryProviderDialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/ui/molecules/tooltip';

interface GroomingProfileHeroProps {
  businessName: string;
  profileImageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  getInitials: (name: string) => string;
  onRatingClick: () => void;
  groomingId: string;
  selectedPetId?: string;
}

const GroomingProfileHero: React.FC<GroomingProfileHeroProps> = ({
  businessName,
  profileImageUrl,
  averageRating = 0,
  totalReviews = 0,
  getInitials,
  onRatingClick,
  groomingId,
  selectedPetId,
}) => {
  const { isModalOpen, openModal, closeModal, isPrimaryGrooming } = usePrimaryGroomingSelection(selectedPetId);
  
  const isCurrentlyPrimary = isPrimaryGrooming(groomingId);
  
  const handleSetAsPrimary = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    openModal();
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
    <>
      <div className="bg-[#79D0B8] pt-20 pb-6 flex flex-col items-center text-white relative">
        {/* Primary Grooming Button */}
        <div className="absolute top-4 right-4 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleSetAsPrimary}
                  className="bg-white/20 p-2 rounded-full transition-colors hover:bg-white/30"
                >
                  <Heart 
                    size={24} 
                    className={isCurrentlyPrimary ? "fill-white text-white" : "text-white"} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-white text-gray-800 text-xs">
                {isCurrentlyPrimary 
                  ? "Gestionar estética de confianza" 
                  : "Establecer como estética de confianza"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4 border-4 border-white">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt={businessName}
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-[#4DA6A8]">
              <Scissors className="w-12 h-12" />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-bold mb-1 text-center">{businessName}</h1>
        
        <p className="text-sm mb-3 text-white/90">Estética</p>
        
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
      </div>

      <PetPrimaryProviderDialog
        open={isModalOpen}
        onClose={closeModal}
        providerId={groomingId}
        providerName={businessName}
        providerType="grooming"
      />
    </>
  );
};

export default GroomingProfileHero;
