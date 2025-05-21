
import React, { useState, useEffect } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/ui/molecules/dropdown-menu';
import { Button } from '@/ui/atoms/button';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Pet } from '@/features/pets/types';
import { usePets } from '@/features/pets/hooks';
import { Skeleton } from '@/ui/atoms/skeleton';
import { Dog, Cat } from 'lucide-react';

interface PetSelectorProps {
  selectedPetId: string | undefined;
  onPetChange: (petId: string) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ selectedPetId, onPetChange }) => {
  const { pets, isLoading } = usePets();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    if (!isLoading && pets.length > 0) {
      // Si no hay mascota seleccionada o la seleccionada no está en la lista
      if (!selectedPetId || !pets.some(pet => pet.id === selectedPetId)) {
        // Establecer la primera mascota como seleccionada
        onPetChange(pets[0].id);
        setSelectedPet(pets[0]);
      } else {
        // Encontrar y establecer la mascota seleccionada
        const pet = pets.find(p => p.id === selectedPetId);
        if (pet) {
          setSelectedPet(pet);
        }
      }
    }
  }, [isLoading, pets, selectedPetId, onPetChange]);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    onPetChange(pet.id);
  };

  const getPetIcon = (petType: string | undefined) => {
    switch (petType?.toLowerCase()) {
      case 'cat':
        return <Cat className="h-4 w-4 text-[#79D0B8]" />;
      case 'dog':
      default:
        return <Dog className="h-4 w-4 text-[#79D0B8]" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-5 w-20" />
      </div>
    );
  }

  if (!selectedPet || pets.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 hover:border-white/40 transition-all duration-200 shadow-sm"
        >
          <Avatar className="h-7 w-7 bg-white/80 border-2 border-[#79D0B8]">
            {selectedPet.profile_picture_url ? (
              <AvatarImage src={selectedPet.profile_picture_url} alt={selectedPet.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-white/90">
                {getPetIcon(selectedPet.species)}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium text-white">{selectedPet.name}</span>
          <ChevronDown size={16} className="text-white opacity-80" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white/90 backdrop-blur-sm border border-white/30 rounded-md shadow-lg p-1 z-50"
      >
        {pets.map((pet) => (
          <DropdownMenuItem 
            key={pet.id} 
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md transition-colors duration-200 ${
              pet.id === selectedPet.id 
                ? 'bg-[#79D0B8]/20 text-[#4DA6A8] font-medium' 
                : 'hover:bg-[#79D0B8]/10 text-gray-700'
            }`}
            onClick={() => handlePetSelect(pet)}
          >
            <Avatar className="h-8 w-8 border-2 border-[#79D0B8]/80">
              {pet.profile_picture_url ? (
                <AvatarImage src={pet.profile_picture_url} alt={pet.name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-white">
                  {getPetIcon(pet.species)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className={`text-sm ${pet.id === selectedPet.id ? 'font-medium' : ''}`}>{pet.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PetSelector;
