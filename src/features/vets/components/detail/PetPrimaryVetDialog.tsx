
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/features/pets/types';
import { Checkbox } from '@/ui/atoms/checkbox';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/molecules/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/molecules/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Check, PawPrint } from 'lucide-react';

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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleTogglePet = (petId: string) => {
    setSelectedPets(prev => {
      if (prev.includes(petId)) {
        return prev.filter(id => id !== petId);
      } else {
        return [...prev, petId];
      }
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      // For each pet, update its primary_vet_id
      for (const pet of pets) {
        const shouldHaveVet = selectedPets.includes(pet.id);
        const hasVet = pet.primary_vet_id === vetId;
        
        // Only update if there's a change
        if (shouldHaveVet !== hasVet) {
          const { error } = await supabase
            .from('pets')
            .update({ 
              primary_vet_id: shouldHaveVet ? vetId : null 
            })
            .eq('id', pet.id)
            .eq('owner_id', user.id); // Safety check
            
          if (error) throw error;
        }
      }
      
      toast({
        title: "Éxito",
        description: "Se actualizaron tus veterinarios de cabecera",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating primary vets:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar tus veterinarios de cabecera",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelClick = () => {
    // If there are changes, show confirmation dialog
    const currentPrimaryPets = pets.filter(pet => pet.primary_vet_id === vetId).map(pet => pet.id);
    const hasChanges = JSON.stringify(currentPrimaryPets.sort()) !== JSON.stringify([...selectedPets].sort());
    
    if (hasChanges) {
      setConfirmDialogOpen(true);
    } else {
      onClose();
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

  return (
    <>
      <Dialog open={open} onOpenChange={handleCancelClick}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Veterinario de cabecera
              <span className="block text-sm text-gray-500 font-normal mt-1">
                Selecciona las mascotas para {vetName}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="py-8">
              <LoadingSpinner size="medium" />
            </div>
          ) : pets.length === 0 ? (
            <div className="py-6 text-center">
              <PawPrint className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">
                No tienes mascotas registradas
              </p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto py-2">
              {pets.map((pet) => (
                <div 
                  key={pet.id}
                  className="flex items-center space-x-3 py-3 hover:bg-gray-50 px-1 rounded-md cursor-pointer"
                  onClick={() => handleTogglePet(pet.id)}
                >
                  <Checkbox 
                    id={`pet-${pet.id}`}
                    checked={selectedPets.includes(pet.id)}
                    onCheckedChange={() => handleTogglePet(pet.id)}
                    className="data-[state=checked]:bg-[#79D0B8] data-[state=checked]:border-[#79D0B8]"
                  />
                  
                  <Avatar className="h-10 w-10 border border-gray-200">
                    {pet.profile_picture_url ? (
                      <AvatarImage src={pet.profile_picture_url} />
                    ) : (
                      <AvatarFallback className="bg-[#F3F4F6] text-gray-700">
                        {getInitials(pet.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {pet.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
                    </div>
                  </div>
                  
                  {selectedPets.includes(pet.id) && (
                    <Check className="h-5 w-5 text-[#79D0B8]" />
                  )}
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelClick}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
              onClick={handleSave}
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Guardando...</span>
                </>
              ) : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialogOpen} 
        onOpenChange={setConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
            <AlertDialogDescription>
              Tienes cambios sin guardar. ¿Estás seguro de que quieres salir sin guardar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setConfirmDialogOpen(false);
                onClose();
              }}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PetPrimaryVetDialog;
