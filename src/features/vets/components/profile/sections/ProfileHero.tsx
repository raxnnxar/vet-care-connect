
import React, { useState, useEffect } from 'react';
import { User, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProfileHeroProps {
  userId: string;
  profileData: {
    profile_image_url?: string;
    average_rating?: number;
    total_reviews?: number;
    license_number?: string;
  };
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ userId, profileData }) => {
  const [displayName, setDisplayName] = useState<string>('');
  
  // Format rating to display with one decimal place
  const formattedRating = profileData?.average_rating 
    ? Number(profileData.average_rating).toFixed(1)
    : '0.0';
  
  useEffect(() => {
    const fetchProfileName = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile name:', error);
      } else if (data?.display_name) {
        setDisplayName(data.display_name);
      }
    };
    
    fetchProfileName();
  }, [userId]);
  
  return (
    <div className="bg-[#79D0B8] p-6 flex flex-col items-center text-white">
      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden mb-4 border-4 border-white">
        {profileData.profile_image_url ? (
          <img 
            src={profileData.profile_image_url} 
            alt={displayName}
            className="w-full h-full object-cover" 
          />
        ) : (
          <User className="w-16 h-16 text-white" />
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-center">{displayName}</h1>
      <p className="text-xl mb-2">Veterinario</p>
      
      {/* Rating and reviews section */}
      <div className="flex items-center bg-[#4DA6A8] rounded-full px-6 py-2 mt-2">
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
          ({profileData.total_reviews || 0} reseñas)
        </span>
      </div>

      {/* Licencia en el hero */}
      <div className="w-full mt-6 flex flex-col items-center">
        {profileData.license_number && (
          <div className="text-white/90 text-sm">
            Licencia: <span className="font-medium">{profileData.license_number}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHero;
