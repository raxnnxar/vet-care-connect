
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
import { Dog } from 'lucide-react';

interface PetSelectorProps {
  selectedPetId: string | undefined;
  onPetChange: (petId: string) => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({ selectedPetId, onPetChange }) => {
  const { getCurrentUserPets } = usePets();
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setIsLoading(true);
        const result = await getCurrentUserPets();
        
        if (result.payload && Array.isArray(result.payload) && result.payload.length > 0) {
          setUserPets(result.payload);
          
          // If no pet is selected yet or the selected pet is not in the list
          if (!selectedPetId || !result.payload.some(pet => pet.id === selectedPetId)) {
            // Set the first pet as selected
            onPetChange(result.payload[0].id);
            setSelectedPet(result.payload[0]);
          } else {
            // Find and set the selected pet
            const pet = result.payload.find(p => p.id === selectedPetId);
            if (pet) {
              setSelectedPet(pet);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user pets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [getCurrentUserPets, selectedPetId, onPetChange]);

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);
    onPetChange(pet.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (!selectedPet || userPets.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-3 py-2 bg-white border-gray-300 hover:bg-gray-50"
        >
          <Avatar className="h-8 w-8 bg-white border border-[#79D0B8]">
            {selectedPet.profile_picture_url ? (
              <AvatarImage src={selectedPet.profile_picture_url} alt={selectedPet.name} className="object-cover" />
            ) : (
              <AvatarFallback>
                <Dog size={16} />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="text-sm font-medium">{selectedPet.name}</span>
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50"
      >
        {userPets.map((pet) => (
          <DropdownMenuItem 
            key={pet.id} 
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md ${
              pet.id === selectedPet.id ? 'bg-[#e8f7f3] text-[#4DA6A8]' : 'hover:bg-gray-100'
            }`}
            onClick={() => handlePetSelect(pet)}
          >
            <Avatar className="h-8 w-8 border border-[#79D0B8]">
              {pet.profile_picture_url ? (
                <AvatarImage src={pet.profile_picture_url} alt={pet.name} className="object-cover" />
              ) : (
                <AvatarFallback>
                  <Dog size={16} />
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
