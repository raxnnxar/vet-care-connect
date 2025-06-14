
import React, { useEffect } from 'react';
import { 
  Sheet, 
  SheetContent,
} from '@/ui/molecules/sheet';
import { Button } from '@/ui/atoms/button';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

// Import the existing components that we'll reuse
import PetPrimaryVetDialogHeader from '@/features/vets/components/detail/PetPrimaryVetDialogHeader';
import PetPrimaryVetStats from '@/features/vets/components/detail/PetPrimaryVetStats';
import PetListItem from '@/features/vets/components/detail/PetListItem';
import EmptyPetsState from '@/features/vets/components/detail/EmptyPetsState';

interface PetPrimaryProviderDialogProps {
  open: boolean;
  onClose: () => void;
  providerName: string;
  providerType: 'vet' | 'grooming';
  pets: any[];
  selectedPets: string[];
  loading: boolean;
  saving: boolean;
  feedbackPet: string | null;
  primaryCount: number;
  onLoadPets: () => void;
  onTogglePet: (petId: string) => void;
}

const PetPrimaryProviderDialog: React.FC<PetPrimaryProviderDialogProps> = ({ 
  open, 
  onClose, 
  providerName,
  providerType,
  pets,
  selectedPets,
  loading,
  saving,
  feedbackPet,
  primaryCount,
  onLoadPets,
  onTogglePet
}) => {
  
  useEffect(() => {
    if (open) {
      onLoadPets();
    }
  }, [open, onLoadPets]);

  const getHeaderText = () => {
    return providerType === 'vet' 
      ? `Veterinario de cabecera`
      : `Estética de confianza`;
  };

  const getSubheaderText = () => {
    return providerType === 'vet' 
      ? `Selecciona las mascotas para ${providerName}`
      : `Selecciona las mascotas para ${providerName}`;
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-gradient-to-b from-white to-gray-50 border-l-[#79D0B8]/30"
      >
        <PetPrimaryVetDialogHeader vetName={getHeaderText()} />
        
        {loading ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner size="medium" />
          </div>
        ) : pets.length === 0 ? (
          <EmptyPetsState />
        ) : (
          <div className="mt-4 space-y-4">
            {/* Stats section */}
            <PetPrimaryVetStats primaryVetCount={primaryCount} />
            
            {/* Pet list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto py-2 px-1">
              <h3 className="font-medium text-gray-700 mb-2">Tus mascotas</h3>
              {pets.map((pet) => {
                const isSelected = selectedPets.includes(pet.id);
                const isUpdating = feedbackPet === pet.id;
                
                return (
                  <PetListItem
                    key={pet.id}
                    pet={pet}
                    isSelected={isSelected}
                    isUpdating={isUpdating}
                    onToggle={onTogglePet}
                  />
                );
              })}
            </div>
            
            <div className="pt-4 mt-2 border-t border-gray-100">
              <Button
                type="button"
                className="w-full bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
                onClick={onClose}
              >
                Listo
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default PetPrimaryProviderDialog;
