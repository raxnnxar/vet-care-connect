
import React from 'react';
import { Bird, Cat, Dog, Pencil, User } from 'lucide-react';
import { Avatar } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Pet } from '../types';

interface PetListItemProps {
  pet: Pet;
  onEditClick: (pet: Pet) => void;
}

const PetListItem: React.FC<PetListItemProps> = ({ pet, onEditClick }) => {
  const getAnimalIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'gato':
        return <Cat className="h-full w-full p-2 text-[#5FBFB3]" />;
      case 'perro':
        return <Dog className="h-full w-full p-2 text-[#5FBFB3]" />;
      case 'ave':
        return <Bird className="h-full w-full p-2 text-[#5FBFB3]" />;
      default:
        return <User className="h-full w-full p-2 text-[#5FBFB3]" />;
    }
  };

  return (
    <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
      <Avatar className="h-14 w-14 border-2 border-[#5FBFB3]/20">
        {pet.profile_picture_url ? (
          <img 
            src={pet.profile_picture_url} 
            alt={pet.name} 
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="bg-white flex items-center justify-center w-full h-full rounded-full">
            {getAnimalIcon(pet.species)}
          </div>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{pet.name}</p>
        <p className="text-sm text-gray-600">
          {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
        </p>
      </div>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onEditClick(pet)}
      >
        <Pencil size={20} />
      </Button>
    </div>
  );
};

export default PetListItem;
