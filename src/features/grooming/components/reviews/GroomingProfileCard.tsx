
import React from 'react';
import { Scissors } from 'lucide-react';

interface GroomingProfileCardProps {
  businessName: string;
  profileImage: string | null;
  getInitials: (name: string) => string;
}

const GroomingProfileCard: React.FC<GroomingProfileCardProps> = ({
  businessName,
  profileImage,
  getInitials
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-[#79D0B8]/20 flex items-center justify-center">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt={businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-[#79D0B8]/30 w-full h-full flex items-center justify-center text-[#79D0B8] text-xl font-bold">
              <Scissors className="w-8 h-8" />
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{businessName}</h3>
          <p className="text-gray-600">Estética</p>
        </div>
      </div>
    </div>
  );
};

export default GroomingProfileCard;
