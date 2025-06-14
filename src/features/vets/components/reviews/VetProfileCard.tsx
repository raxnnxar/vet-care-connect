
import React from 'react';

interface VetProfileCardProps {
  vetName: string;
  vetSpecialty: string;
  profileImage: string | null;
  getInitials?: (name: string) => string;
}

const VetProfileCard: React.FC<VetProfileCardProps> = ({
  vetName,
  vetSpecialty,
  profileImage,
  getInitials
}) => {
  // Default getInitials function if not provided
  const defaultGetInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initialsFunction = getInitials || defaultGetInitials;

  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mr-4">
        {profileImage ? (
          <img src={profileImage} alt={vetName} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-[#79D0B8] w-full h-full flex items-center justify-center text-white text-xl font-bold">
            {initialsFunction(vetName)}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="font-semibold text-lg">{vetName}</h2>
        <p className="text-gray-600">{vetSpecialty}</p>
      </div>
    </div>
  );
};

export default VetProfileCard;
