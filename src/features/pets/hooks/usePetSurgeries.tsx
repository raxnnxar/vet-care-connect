
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PetSurgery } from '@/features/pets/types/formTypes';
import { toast } from 'sonner';

export const usePetSurgeries = (petId: string) => {
  const [surgeries, setSurgeries] = useState<PetSurgery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSurgeries = async () => {
    if (!petId) return;
    
    try {
      const { data, error } = await supabase
        .from('pet_surgeries')
        .select('*')
        .eq('pet_id', petId)
        .order('surgery_date', { ascending: false });

      if (error) throw error;
      setSurgeries(data || []);
    } catch (error) {
      console.error('Error fetching surgeries:', error);
      toast.error('Error al cargar las cirugías');
    } finally {
      setIsLoading(false);
    }
  };

  const addSurgery = async (procedure: string, surgery_date?: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_surgeries')
        .insert({
          pet_id: petId,
          procedure,
          surgery_date,
          notes,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSurgeries(prev => [data, ...prev]);
      toast.success('Cirugía añadida exitosamente');
      return data;
    } catch (error) {
      console.error('Error adding surgery:', error);
      toast.error('Error al añadir la cirugía');
      throw error;
    }
  };

  const updateSurgery = async (id: string, procedure: string, surgery_date?: string, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('pet_surgeries')
        .update({ procedure, surgery_date, notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSurgeries(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Cirugía actualizada exitosamente');
      return data;
    } catch (error) {
      console.error('Error updating surgery:', error);
      toast.error('Error al actualizar la cirugía');
      throw error;
    }
  };

  const deleteSurgery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pet_surgeries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSurgeries(prev => prev.filter(item => item.id !== id));
      toast.success('Cirugía eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting surgery:', error);
      toast.error('Error al eliminar la cirugía');
      throw error;
    }
  };

  useEffect(() => {
    fetchSurgeries();
  }, [petId]);

  return {
    surgeries,
    isLoading,
    addSurgery,
    updateSurgery,
    deleteSurgery,
    refetch: fetchSurgeries
  };
};
