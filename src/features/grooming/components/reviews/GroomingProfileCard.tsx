
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
    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-4">
        {profileImage ? (
          <img src={profileImage} alt={businessName} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-[#79D0B8] w-full h-full flex items-center justify-center text-white text-xl font-bold">
            <Scissors className="w-8 h-8" />
          </div>
        )}
      </div>
      
      <div>
        <h2 className="font-semibold text-lg">{businessName}</h2>
        <p className="text-gray-600">Estética de mascotas</p>
      </div>
    </div>
  );
};

export default GroomingProfileCard;
