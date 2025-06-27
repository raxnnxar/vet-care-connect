
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PetAllergy } from '@/features/pets/types/formTypes';
import { toast } from 'sonner';

export const usePetAllergies = (petId: string) => {
  const [allergies, setAllergies] = useState<PetAllergy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllergies = async () => {
    if (!petId) return;
    
    try {
      const { data, error } = await supabase
        .from('pet_allergies')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllergies(data || []);
    } catch (error) {
      console.error('Error fetching allergies:', error);
      toast.error('Error al cargar las alergias');
    } finally {
      setIsLoading(false);
    }
  };

  const addAllergy = async (allergen: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_allergies')
        .insert({
          pet_id: petId,
          allergen,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      
      setAllergies(prev => [data, ...prev]);
      toast.success('Alergia añadida exitosamente');
      return data;
    } catch (error) {
      console.error('Error adding allergy:', error);
      toast.error('Error al añadir la alergia');
      throw error;
    }
  };

  const updateAllergy = async (id: string, allergen: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_allergies')
        .update({ allergen, notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAllergies(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Alergia actualizada exitosamente');
      return data;
    } catch (error) {
      console.error('Error updating allergy:', error);
      toast.error('Error al actualizar la alergia');
      throw error;
    }
  };

  const deleteAllergy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pet_allergies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAllergies(prev => prev.filter(item => item.id !== id));
      toast.success('Alergia eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting allergy:', error);
      toast.error('Error al eliminar la alergia');
      throw error;
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, [petId]);

  return {
    allergies,
    isLoading,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    refetch: fetchAllergies
  };
};
