
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/features/pets/types';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { 
  Sheet, 
  SheetContent,
} from '@/ui/molecules/sheet';
import { Button } from '@/ui/atoms/button';

// Import components from existing vet dialog
import PetPrimaryVetDialogHeader from '@/features/vets/components/detail/PetPrimaryVetDialogHeader';
import PetPrimaryVetStats from '@/features/vets/components/detail/PetPrimaryVetStats';
import PetListItem from '@/features/vets/components/detail/PetListItem';
import EmptyPetsState from '@/features/vets/components/detail/EmptyPetsState';

interface PetPrimaryProviderDialogProps {
  open: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  providerType: 'vet' | 'grooming';
}

const PetPrimaryProviderDialog: React.FC<PetPrimaryProviderDialogProps> = ({ 
  open, 
  onClose, 
  providerId,
  providerName,
  providerType
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedbackPet, setFeedbackPet] = useState<string | null>(null);
  const { toast } = useToast();

  const primaryFieldName = providerType === 'vet' ? 'primary_vet_id' : 'primary_grooming_id';
  const dialogTitle = providerType === 'vet' ? 'Veterinario de cabecera' : 'Estética de confianza';

  const loadPets = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch all pets for the current user
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      
      setPets(data || []);

      // Get the list of pets that already have this provider as primary
      const petsWithThisProvider = data?.filter(pet => pet[primaryFieldName] === providerId) || [];
      setSelectedPets(petsWithThisProvider.map(pet => pet.id));
    } catch (error) {
      console.error('Error loading pets:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus mascotas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadPets();
    }
  }, [open, user?.id]);

  const handleTogglePet = async (petId: string) => {
    if (saving) return;
    
    // Toggle the selection in the UI immediately for responsive feedback
    const isCurrentlySelected = selectedPets.includes(petId);
    const newSelectedPets = isCurrentlySelected
      ? selectedPets.filter(id => id !== petId)
      : [...selectedPets, petId];
    
    setSelectedPets(newSelectedPets);
    setSaving(true);
    setFeedbackPet(petId);
    
    try {
      const pet = pets.find(p => p.id === petId);
      if (!pet) throw new Error("Mascota no encontrada");
      
      // Update the pet's primary provider field directly
      const updateData = { 
        [primaryFieldName]: isCurrentlySelected ? null : providerId 
      };
      
      const { error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .eq('owner_id', user?.id); // Safety check
      
      if (error) throw error;
      
      const providerTypeText = providerType === 'vet' ? 'veterinario de cabecera' : 'estética de confianza';
      
      toast({
        title: isCurrentlySelected ? "Eliminado" : "Asignado",
        description: isCurrentlySelected 
          ? `${pet.name} ya no tiene a ${providerName} como ${providerTypeText}` 
          : `${providerName} es ahora ${providerTypeText === 'veterinario de cabecera' ? 'el' : 'la'} ${providerTypeText} de ${pet.name}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating primary provider:', error);
      
      // Revert the UI state if there was an error
      setSelectedPets(isCurrentlySelected 
        ? [...selectedPets] 
        : selectedPets.filter(id => id !== petId));
      
      toast({
        title: "Error",
        description: `No se pudo actualizar ${providerType === 'vet' ? 'el veterinario de cabecera' : 'la estética de confianza'}`,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
      
      // Clear the feedback after a short delay
      setTimeout(() => setFeedbackPet(null), 500);
    }
  };
  
  // Count how many pets have this provider as primary
  const primaryProviderCount = selectedPets.length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-gradient-to-b from-white to-gray-50 border-l-[#79D0B8]/30"
      >
        <PetPrimaryVetDialogHeader vetName={providerName} title={dialogTitle} />
        
        {loading ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner size="medium" />
          </div>
        ) : pets.length === 0 ? (
          <EmptyPetsState />
        ) : (
          <div className="mt-4 space-y-4">
            {/* Stats section */}
            <PetPrimaryVetStats primaryVetCount={primaryProviderCount} providerType={providerType} />
            
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
                    onToggle={handleTogglePet}
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
