
import React, { useState, useEffect } from 'react';
import { Scissors, Star } from 'lucide-react';
import { GroomingProfile } from '@/features/auth/types/groomingTypes';
import { supabase } from '@/integrations/supabase/client';

interface GroomingProfileHeroProps {
  userId: string;
  profileData: GroomingProfile;
}

const GroomingProfileHero: React.FC<GroomingProfileHeroProps> = ({ 
  userId, 
  profileData
}) => {
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  
  useEffect(() => {
    const fetchRatings = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('pet_grooming')
          .select('average_rating, total_reviews')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching ratings:', error);
          return;
        }
        
        if (data) {
          setAverageRating(data.average_rating ? Number(data.average_rating) : 0);
          setTotalReviews(data.total_reviews || 0);
        }
      } catch (err) {
        console.error('Error in fetchRatings:', err);
      }
    };
    
    fetchRatings();
  }, [userId]);
  
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
      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4 border-4 border-white">
        {profileData.profile_image_url ? (
          <img 
            src={profileData.profile_image_url} 
            alt="Perfil del negocio" 
            className="w-full h-full object-cover"
          />
        ) : (
          <Scissors className="w-12 h-12 text-white" />
        )}
      </div>
      
      {/* Business Name */}
      <h1 className="text-2xl font-bold mb-1 text-center">
        {profileData.business_name || 'Estética Canina'}
      </h1>
      
      {/* Service Type Label */}
      <p className="text-sm mb-3 text-white/90">Estética</p>
      
      {/* Rating Section */}
      <div className="flex items-center bg-[#4DA6A8] rounded-full px-4 py-1 mt-1 mb-2">
        <span className="text-lg font-bold mr-2">{formattedRating}</span>
        <div className="flex">
          {renderRatingStars()}
        </div>
        <span className="ml-2 text-sm">
          ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
        </span>
      </div>
    </div>
  );
};

export default GroomingProfileHero;
