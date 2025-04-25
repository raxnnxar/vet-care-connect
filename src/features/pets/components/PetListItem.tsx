
import React from 'react';
import { Bird, Cat, Dog, ChevronRight, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Pet } from '../types';

interface PetListItemProps {
  pet: Pet;
  onClick: (pet: Pet) => void;
}

const PetListItem: React.FC<PetListItemProps> = ({ pet, onClick }) => {
  const getAnimalIcon = (species: string | undefined) => {
    if (!species) {
      return <User className="h-full w-full p-2 text-[#5FBFB3]" />;
    }
    
    switch (species.toLowerCase()) {
      case 'gato':
      case 'cat':
        return <Cat className="h-full w-full p-2 text-[#5FBFB3]" />;
      case 'perro':
      case 'dog':
        return <Dog className="h-full w-full p-2 text-[#5FBFB3]" />;
      case 'ave':
      case 'bird':
        return <Bird className="h-full w-full p-2 text-[#5FBFB3]" />;
      default:
        return <User className="h-full w-full p-2 text-[#5FBFB3]" />;
    }
  };

  return (
    <div 
      className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
      onClick={() => onClick(pet)}
    >
      <Avatar className="h-14 w-14 border-2 border-[#5FBFB3]/20">
        {pet.profile_picture_url ? (
          <AvatarImage 
            src={pet.profile_picture_url} 
            alt={pet.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <AvatarFallback className="bg-white flex items-center justify-center w-full h-full">
            {getAnimalIcon(pet.species)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{pet.name}</p>
        <p className="text-sm text-gray-600">
          {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
        </p>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </div>
  );
};

export default PetListItem;
