
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/features/pets/types';
import { useToast } from '@/hooks/use-toast';

export const usePrimaryVet = (vetId: string, vetName: string) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedbackPet, setFeedbackPet] = useState<string | null>(null);
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
      
      // Update the pet's primary_vet_id directly
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

  return {
    pets,
    selectedPets,
    loading,
    saving,
    feedbackPet,
    loadPets,
    handleTogglePet,
    primaryVetCount: selectedPets.length
  };
};
