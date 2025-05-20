
import { useState, useEffect } from 'react';
import { Pet } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { toast } from 'sonner';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      fetchPets();
    } else {
      setPets([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user?.id);

      if (error) {
        throw error;
      }

      setPets(data || []);
    } catch (err: any) {
      console.error('Error fetching pets:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createPet = async (petData: Omit<Pet, 'id' | 'created_at' | 'owner_id'>) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create a pet');
      }

      const { data, error } = await supabase
        .from('pets')
        .insert({ ...petData, owner_id: user.id })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPets(prevPets => [...prevPets, data as Pet]);
      toast.success('Mascota añadida exitosamente');
      return data;
    } catch (err: any) {
      console.error('Error creating pet:', err);
      toast.error(`Error al crear mascota: ${err.message}`);
      throw err;
    }
  };

  const updatePet = async (petId: string, petData: Partial<Pet>) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .update(petData)
        .eq('id', petId)
        .eq('owner_id', user?.id)  // Ensure the user can only update their own pets
        .select()
        .single();

      if (error) {
        throw error;
      }

      setPets(prevPets =>
        prevPets.map(pet => (pet.id === petId ? { ...pet, ...data } as Pet : pet))
      );
      toast.success('Mascota actualizada exitosamente');
      return data;
    } catch (err: any) {
      console.error('Error updating pet:', err);
      toast.error(`Error al actualizar mascota: ${err.message}`);
      throw err;
    }
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('owner_id', user?.id);  // Ensure the user can only delete their own pets

      if (error) {
        throw error;
      }

      setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
      toast.success('Mascota eliminada exitosamente');
    } catch (err: any) {
      console.error('Error deleting pet:', err);
      toast.error(`Error al eliminar mascota: ${err.message}`);
      throw err;
    }
  };

  const getPetById = async (petId: string) => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data as Pet | null;
    } catch (err: any) {
      console.error('Error fetching pet by id:', err);
      throw err;
    }
  };

  return {
    pets,
    isLoading,
    error,
    fetchPets,
    createPet,
    updatePet,
    deletePet,
    getPetById
  };
};
