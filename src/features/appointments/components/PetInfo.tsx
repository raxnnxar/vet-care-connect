
import React from 'react';
import { Avatar } from '@/ui/atoms/avatar';
import { Pet } from '@/features/pets/types';
import { Bird, Cat, Dog, User } from 'lucide-react';

interface PetInfoProps {
  pet: Pet | null;
}

export const PetInfo: React.FC<PetInfoProps> = ({ pet }) => {
  const getAnimalIcon = (species: string | undefined) => {
    if (!species) return <User className="h-full w-full p-2 text-[#5FBFB3]" />;
    
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

  if (!pet) return null;

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 border-2 border-[#5FBFB3]/20">
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
      <div>
        <h3 className="font-semibold text-lg">{pet.name}</h3>
        <p className="text-gray-600">
          {pet.species} {pet.breed ? `- ${pet.breed}` : ''}
        </p>
      </div>
    </div>
  );
};
