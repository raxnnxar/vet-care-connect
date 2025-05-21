
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Heart } from 'lucide-react';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { usePetPrimaryVet } from '../hooks/usePetPrimaryVet';
import PetPrimaryVetDialog from './PetPrimaryVetDialog';

interface VetCardProps {
  vet: {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    specialization: string[];
    imageUrl: string;
    rating: number;
    reviewCount: number;
    distance: string;
    animalsTreated: string[];
  };
  onClick: (vetId: string) => void;
}

const VetCard: React.FC<VetCardProps> = ({ vet, onClick }) => {
  const [showPetDialog, setShowPetDialog] = useState(false);
  const { petsWithVet, loadPetsWithVet, hasAsPrimaryVet } = usePetPrimaryVet(vet.id);
  
  useEffect(() => {
    loadPetsWithVet();
  }, []);
  
  // Format specialization to display in uppercase with +X for additional ones
  const formatSpecialization = () => {
    if (!vet.specialization || vet.specialization.length === 0) {
      return "MEDICINA GENERAL";
    }
    
    const primary = vet.specialization[0].toUpperCase();
    
    if (vet.specialization.length > 1) {
      return `${primary} +${vet.specialization.length - 1}`;
    }
    
    return primary;
  };
  
  // Format animals treated
  const formatAnimalsTreated = () => {
    if (!vet.animalsTreated || vet.animalsTreated.length === 0) {
      return "Trata: Animales domésticos";
    }
    
    if (vet.animalsTreated.length <= 2) {
      return `Trata: ${vet.animalsTreated.join(', ')}`;
    }
    
    return `Trata: ${vet.animalsTreated[0]}, ${vet.animalsTreated[1]} +${vet.animalsTreated.length - 2}`;
  };
  
  // Generate initials for the avatar
  const getInitials = () => {
    const firstInitial = vet.firstName ? vet.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = vet.lastName ? vet.lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}`;
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPetDialog(true);
  };
  
  return (
    <>
      <Card 
        key={vet.id}
        className="p-4 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow rounded-xl relative overflow-hidden border border-gray-200"
        onClick={() => onClick(vet.id)}
      >
        <Avatar className="h-16 w-16 mr-3 shadow-sm">
          {vet.imageUrl ? (
            <AvatarImage src={vet.imageUrl} alt={vet.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-[#79D0B8] text-white">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[#1F2937] text-base">{vet.name}</h3>
            <button 
              onClick={handleFavoriteClick}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={hasAsPrimaryVet ? "Quitar como veterinario de cabecera" : "Marcar como veterinario de cabecera"}
            >
              <Heart 
                className={`w-5 h-5 ${hasAsPrimaryVet ? 'fill-[#FF8A65] text-[#FF8A65]' : 'text-gray-400'}`} 
              />
            </button>
          </div>
          <p className="text-sm text-gray-500 font-medium">{formatSpecialization()}</p>
          <p className="text-xs text-gray-500 mt-0.5">{formatAnimalsTreated()}</p>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm font-medium">{vet.rating.toFixed(1)}</span>
            <span className="ml-1 text-xs text-gray-500">({vet.reviewCount} reseñas)</span>
            <div className="ml-auto flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              {vet.distance}
            </div>
          </div>
        </div>
      </Card>
      
      <PetPrimaryVetDialog 
        vetId={vet.id} 
        vetName={vet.name}
        isOpen={showPetDialog}
        onClose={() => setShowPetDialog(false)}
      />
    </>
  );
};

export default VetCard;
