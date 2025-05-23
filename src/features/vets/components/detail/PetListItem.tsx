
import React from 'react';
import { Pet } from '@/features/pets/types';
import { Switch } from '@/ui/atoms/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';

interface PetListItemProps {
  pet: Pet;
  isSelected: boolean;
  isUpdating: boolean;
  onToggle: (petId: string) => void;
}

const PetListItem: React.FC<PetListItemProps> = ({
  pet,
  isSelected,
  isUpdating,
  onToggle
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div 
      key={pet.id}
      onClick={() => onToggle(pet.id)}
      className={`
        flex items-center justify-between p-3 rounded-xl
        transition-all duration-200 cursor-pointer
        ${isSelected ? 'bg-[#E6F7F5] shadow-sm' : 'bg-white hover:bg-gray-50'}
        ${isUpdating ? 'scale-[0.98]' : 'scale-100'}
        border border-gray-200
      `}
    >
      <div className="flex items-center gap-3">
        <Avatar className={`h-12 w-12 border-2 ${isSelected ? 'border-[#79D0B8]' : 'border-gray-200'}`}>
          {pet.profile_picture_url ? (
            <AvatarImage src={pet.profile_picture_url} />
          ) : (
            <AvatarFallback className={`${isSelected ? 'bg-[#79D0B8]/10 text-[#79D0B8]' : 'bg-gray-100 text-gray-500'}`}>
              {getInitials(pet.name)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <div className="font-medium text-gray-800">
            {pet.name}
          </div>
        </div>
      </div>
      
      <Switch 
        checked={isSelected}
        className="data-[state=checked]:bg-[#79D0B8]"
        disabled={isUpdating}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(pet.id);
        }}
      />
    </div>
  );
};

export default PetListItem;
