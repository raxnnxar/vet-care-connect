
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/features/pets/types';
import { Switch } from '@/ui/atoms/switch';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
} from '@/ui/molecules/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/ui/molecules/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { ChevronDown } from 'lucide-react';

interface PetPrimaryVetDialogProps {
  open: boolean;
  onClose: () => void;
  vetId: string;
  vetName: string;
}

const PetPrimaryVetDialog: React.FC<PetPrimaryVetDialogProps> = ({ 
  open, 
  onClose, 
  vetId,
  vetName
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedbackPet, setFeedbackPet] = useState<string | null>(null);
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

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

      // Get the list of pets that already have this vet as primary
      const petsWithThisVet = data?.filter(pet => pet.primary_vet_id === vetId) || [];
      setSelectedPets(petsWithThisVet.map(pet => pet.id));
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
      
      // Update the pet's primary_vet_id directly without batch updates
      const { error } = await supabase
        .from('pets')
        .update({ 
          primary_vet_id: isCurrentlySelected ? null : vetId 
        })
        .eq('id', petId)
        .eq('owner_id', user?.id); // Safety check
      
      if (error) throw error;
      
      toast({
        title: isCurrentlySelected ? "Eliminado" : "Asignado",
        description: isCurrentlySelected 
          ? `${pet.name} ya no tiene a ${vetName} como veterinario de cabecera` 
          : `${vetName} es ahora el veterinario de cabecera de ${pet.name}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating primary vet:', error);
      
      // Revert the UI state if there was an error
      setSelectedPets(isCurrentlySelected 
        ? [...selectedPets] 
        : selectedPets.filter(id => id !== petId));
      
      toast({
        title: "Error",
        description: "No se pudo actualizar el veterinario de cabecera",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
      
      // Clear the feedback after a short delay
      setTimeout(() => setFeedbackPet(null), 500);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Count how many pets have this vet as primary
  const primaryVetCount = selectedPets.length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-gradient-to-b from-white to-gray-50 border-l-[#79D0B8]/30"
      >
        <SheetHeader className="pb-4 border-b border-gray-100">
          <SheetTitle className="text-center text-xl font-semibold text-gray-800">
            <span className="block">Veterinario de cabecera</span>
            <span className="block text-sm text-gray-500 font-normal mt-1">
              Selecciona las mascotas para {vetName}
            </span>
          </SheetTitle>
        </SheetHeader>
        
        {loading ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner size="medium" />
          </div>
        ) : pets.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">
              No tienes mascotas registradas
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {/* Stats section */}
            <Collapsible 
              open={expanded} 
              onOpenChange={setExpanded}
              className="rounded-lg bg-[#F3F9F8] border border-[#79D0B8]/20 p-4"
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer">
                  <div>
                    <h3 className="font-medium text-gray-800">Estado actual</h3>
                    <p className="text-sm text-gray-600">
                      {primaryVetCount === 0 
                        ? "No es veterinario de cabecera para ninguna mascota" 
                        : `Es veterinario de cabecera para ${primaryVetCount} ${primaryVetCount === 1 ? 'mascota' : 'mascotas'}`}
                    </p>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pt-3">
                <p className="text-sm text-gray-600 mb-1">
                  El veterinario de cabecera:
                </p>
                <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                  <li>Conoce el historial médico completo de tu mascota</li>
                  <li>Puede hacer seguimiento continuo a tratamientos</li>
                  <li>Recibe notificaciones cuando hay cambios en la salud de tu mascota</li>
                </ul>
              </CollapsibleContent>
            </Collapsible>
            
            {/* Pet list */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto py-2 px-1">
              <h3 className="font-medium text-gray-700 mb-2">Tus mascotas</h3>
              {pets.map((pet) => {
                const isSelected = selectedPets.includes(pet.id);
                const isUpdating = feedbackPet === pet.id;
                
                return (
                  <div 
                    key={pet.id}
                    onClick={() => handleTogglePet(pet.id)}
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
                        {/* Se eliminó la sección que mostraba el icono de animal y la especie */}
                      </div>
                    </div>
                    
                    <Switch 
                      checked={isSelected}
                      className="data-[state=checked]:bg-[#79D0B8]"
                      disabled={isUpdating}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePet(pet.id);
                      }}
                    />
                  </div>
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

export default PetPrimaryVetDialog;
