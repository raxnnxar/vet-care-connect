
import React from 'react';
import { User, Scissors } from 'lucide-react';
import { GroomingProfile } from '@/features/auth/types/groomingTypes';

interface GroomingProfileHeroProps {
  userId: string;
  profileData: GroomingProfile;
}

const GroomingProfileHero: React.FC<GroomingProfileHeroProps> = ({ 
  userId, 
  profileData 
}) => {
  return (
    <div className="h-48 bg-gradient-to-r from-[#79D0B8] to-[#5FBFB3] relative">
      <div className="absolute bottom-4 left-4 flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg flex items-center justify-center">
          {profileData.profile_image_url ? (
            <img 
              src={profileData.profile_image_url} 
              alt="Perfil del negocio" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Scissors className="w-10 h-10 text-[#79D0B8]" />
          )}
        </div>
        <div className="text-white">
          <h1 className="text-2xl font-bold">
            {profileData.business_name || 'Estética Canina'}
          </h1>
          <p className="text-white/90 flex items-center mt-1">
            <Scissors className="w-4 h-4 mr-1" />
            Servicios de estética canina
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroomingProfileHero;
