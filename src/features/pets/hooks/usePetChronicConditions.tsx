
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PetChronicCondition } from '@/features/pets/types/formTypes';
import { toast } from 'sonner';

export const usePetChronicConditions = (petId: string) => {
  const [conditions, setConditions] = useState<PetChronicCondition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConditions = async () => {
    if (!petId) return;
    
    try {
      const { data, error } = await supabase
        .from('pet_chronic_conditions')
        .select('*')
        .eq('pet_id', petId)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setConditions(data || []);
    } catch (error) {
      console.error('Error fetching chronic conditions:', error);
      toast.error('Error al cargar las condiciones crónicas');
    } finally {
      setIsLoading(false);
    }
  };

  const addCondition = async (condition: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_chronic_conditions')
        .insert({
          pet_id: petId,
          condition,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      
      setConditions(prev => [data, ...prev]);
      toast.success('Condición crónica añadida exitosamente');
      return data;
    } catch (error) {
      console.error('Error adding chronic condition:', error);
      toast.error('Error al añadir la condición crónica');
      throw error;
    }
  };

  const updateCondition = async (id: string, condition: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_chronic_conditions')
        .update({ condition, notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setConditions(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Condición crónica actualizada exitosamente');
      return data;
    } catch (error) {
      console.error('Error updating chronic condition:', error);
      toast.error('Error al actualizar la condición crónica');
      throw error;
    }
  };

  const deleteCondition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pet_chronic_conditions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setConditions(prev => prev.filter(item => item.id !== id));
      toast.success('Condición crónica eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting chronic condition:', error);
      toast.error('Error al eliminar la condición crónica');
      throw error;
    }
  };

  useEffect(() => {
    fetchConditions();
  }, [petId]);

  return {
    conditions,
    isLoading,
    addCondition,
    updateCondition,
    deleteCondition,
    refetch: fetchConditions
  };
};
