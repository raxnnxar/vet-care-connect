
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/features/pets/types';
import { useToast } from '@/hooks/use-toast';

export const usePrimaryGroomingSelection = (groomingId: string, groomingName: string) => {
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

      // Get the list of pets that already have this grooming as primary
      const petsWithThisGrooming = data?.filter(pet => pet.primary_grooming_id === groomingId) || [];
      setSelectedPets(petsWithThisGrooming.map(pet => pet.id));
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
      
      // Update the pet's primary_grooming_id directly
      const { error } = await supabase
        .from('pets')
        .update({ 
          primary_grooming_id: isCurrentlySelected ? null : groomingId 
        })
        .eq('id', petId)
        .eq('owner_id', user?.id); // Safety check
      
      if (error) throw error;
      
      toast({
        title: isCurrentlySelected ? "Eliminado" : "Asignado",
        description: isCurrentlySelected 
          ? `${pet.name} ya no tiene a ${groomingName} como estética de confianza` 
          : `${groomingName} es ahora la estética de confianza de ${pet.name}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating primary grooming:', error);
      
      // Revert the UI state if there was an error
      setSelectedPets(isCurrentlySelected 
        ? [...selectedPets] 
        : selectedPets.filter(id => id !== petId));
      
      toast({
        title: "Error",
        description: "No se pudo actualizar la estética de confianza",
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
    primaryGroomingCount: selectedPets.length
  };
};
