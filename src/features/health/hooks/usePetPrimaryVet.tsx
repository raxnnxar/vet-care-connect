
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useToast } from '@/hooks/use-toast';
import { setPetPrimaryVet, getPetsWithPrimaryVet } from '../services/setPetPrimaryVetService';
import { usePets } from '@/features/pets/hooks';

export const usePetPrimaryVet = (vetId: string) => {
  const [loading, setLoading] = useState(false);
  const [petsWithVet, setPetsWithVet] = useState<string[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);
  const { pets } = usePets();
  const { toast } = useToast();

  const loadPetsWithVet = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await getPetsWithPrimaryVet(user.id, vetId);
      
      if (result.success && result.data) {
        setPetsWithVet(result.data.map(pet => pet.id));
      }
    } catch (error) {
      console.error("Error loading pets with vet:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePetPrimaryVet = async (petId: string, isSelected: boolean) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Debe iniciar sesión para realizar esta acción",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      // If selected, set this vet as primary, otherwise remove it
      const newVetId = isSelected ? vetId : null;
      const result = await setPetPrimaryVet(petId, newVetId);
      
      if (result.success) {
        // Update local state
        if (isSelected) {
          setPetsWithVet(prev => [...prev, petId]);
        } else {
          setPetsWithVet(prev => prev.filter(id => id !== petId));
        }
        return true;
      } else {
        throw new Error("No se pudo actualizar el veterinario principal");
      }
    } catch (error) {
      console.error("Error updating pet primary vet:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el veterinario principal",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    petsWithVet,
    loading,
    loadPetsWithVet,
    updatePetPrimaryVet,
    hasAsPrimaryVet: petsWithVet.length > 0
  };
};
