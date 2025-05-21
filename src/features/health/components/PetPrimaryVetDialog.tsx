
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/ui/molecules/dialog";
import { Button } from "@/ui/atoms/button";
import { Checkbox } from "@/ui/atoms/checkbox";
import { Dog, Cat, X } from 'lucide-react';
import { usePets } from '@/features/pets/hooks';
import { usePetPrimaryVet } from '../hooks/usePetPrimaryVet';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Pet } from '@/features/pets/types';
import { Separator } from '@/ui/atoms/separator';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface PetPrimaryVetDialogProps {
  vetId: string;
  vetName: string;
  isOpen: boolean;
  onClose: () => void;
}

const PetPrimaryVetDialog: React.FC<PetPrimaryVetDialogProps> = ({ 
  vetId, 
  vetName,
  isOpen, 
  onClose 
}) => {
  const { pets, isLoading: petsLoading } = usePets();
  const { toast } = useToast();
  const { petsWithVet, loading, loadPetsWithVet, updatePetPrimaryVet } = usePetPrimaryVet(vetId);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPetsWithVet();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedPets(petsWithVet);
  }, [petsWithVet]);

  const handlePetToggle = (petId: string) => {
    setSelectedPets(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Process pet selections
      const promises = [];
      
      // Find pets to add
      for (const petId of selectedPets) {
        if (!petsWithVet.includes(petId)) {
          promises.push(updatePetPrimaryVet(petId, true));
        }
      }
      
      // Find pets to remove
      for (const petId of petsWithVet) {
        if (!selectedPets.includes(petId)) {
          promises.push(updatePetPrimaryVet(petId, false));
        }
      }
      
      await Promise.all(promises);
      
      toast({
        title: "Cambios guardados",
        description: "Las preferencias de veterinario han sido actualizadas",
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getPetIcon = (petSpecies: string | undefined) => {
    switch (petSpecies?.toLowerCase()) {
      case 'cat':
        return <Cat className="h-4 w-4 text-[#79D0B8]" />;
      case 'dog':
      default:
        return <Dog className="h-4 w-4 text-[#79D0B8]" />;
    }
  };

  if (loading || petsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cargando...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center text-lg">
            Seleccionar mascotas para {vetName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-sm text-gray-600 mb-4 text-center">
          Selecciona las mascotas para las que deseas establecer a este veterinario como veterinario de cabecera
        </div>
        
        <Separator className="mb-4" />
        
        <div className="max-h-[300px] overflow-y-auto pr-2">
          {pets.length > 0 ? (
            pets.map((pet: Pet) => (
              <div 
                key={pet.id} 
                className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Checkbox 
                  id={`pet-${pet.id}`}
                  checked={selectedPets.includes(pet.id)} 
                  onCheckedChange={() => handlePetToggle(pet.id)}
                  className="border-[#79D0B8] data-[state=checked]:bg-[#79D0B8] data-[state=checked]:text-white"
                />
                <label 
                  htmlFor={`pet-${pet.id}`}
                  className="flex items-center flex-1 cursor-pointer"
                >
                  <Avatar className="h-8 w-8 mr-3 border border-gray-200">
                    {pet.profile_picture_url ? (
                      <AvatarImage 
                        src={pet.profile_picture_url} 
                        alt={pet.name} 
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gray-100">
                        {getPetIcon(pet.species)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="font-medium">{pet.name}</span>
                </label>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No tienes mascotas registradas
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="w-full sm:w-auto order-1 sm:order-2 bg-[#79D0B8] hover:bg-[#5FBFB3]"
            disabled={isSaving}
          >
            {isSaving ? <LoadingSpinner size="sm" /> : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PetPrimaryVetDialog;
