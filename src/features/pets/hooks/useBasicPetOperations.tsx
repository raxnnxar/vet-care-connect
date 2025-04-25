
import { useCallback } from 'react';
import { useAppDispatch } from '@/state/store';
import { addPet, fetchPetById, fetchPets, fetchPetsByOwner, modifyPet, removePet } from '../store/petsThunks';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { toast } from 'sonner';
import { Pet } from '../types';

export const useBasicPetOperations = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const getAllPets = useCallback(() => {
    return dispatch(fetchPets(undefined));
  }, [dispatch]);
  
  const getPetById = useCallback((id: string) => {
    return dispatch(fetchPetById(id));
  }, [dispatch]);
  
  const getCurrentUserPets = useCallback(() => {
    if (!user?.id) {
      console.error('Cannot get pets: No user ID available');
      return Promise.resolve({ payload: [] });
    }
    return dispatch(fetchPetsByOwner(user.id));
  }, [dispatch, user?.id]);
  
  const createPet = useCallback(async (petData: any) => {
    try {
      if (!user?.id) {
        console.error('Cannot create pet: No user ID available');
        toast.error('Error: Usuario no identificado');
        return null;
      }
      
      // Ensure the pet has an owner ID
      if (!petData.owner_id) {
        petData.owner_id = user.id;
      }
      
      console.log('Creating pet with data:', petData);
      
      const result = await dispatch(addPet(petData));
      
      if (result.meta.requestStatus === 'rejected') {
        console.error('Pet creation rejected:', result.payload);
        toast.error('Error al crear la mascota');
        return null;
      }
      
      console.log('Pet created successfully:', result.payload);
      return result.payload;
    } catch (error) {
      console.error('Error in createPet:', error);
      toast.error('Error al crear la mascota');
      return null;
    }
  }, [dispatch, user?.id]);
  
  const updatePet = useCallback(async (id: string, petData: any) => {
    try {
      const result = await dispatch(modifyPet({ id, petData }));
      if (result.meta.requestStatus === 'rejected') {
        console.error('Pet update rejected:', result.payload);
        toast.error('Error al actualizar la mascota');
        return null;
      }
      
      console.log('Pet updated successfully:', result.payload);
      return result.payload;
    } catch (error) {
      console.error('Error in updatePet:', error);
      toast.error('Error al actualizar la mascota');
      return null;
    }
  }, [dispatch]);
  
  const deletePet = useCallback(async (id: string) => {
    try {
      const result = await dispatch(removePet(id));
      if (result.meta.requestStatus === 'rejected') {
        toast.error('Error al eliminar la mascota');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error in deletePet:', error);
      toast.error('Error al eliminar la mascota');
      return false;
    }
  }, [dispatch]);
  
  return {
    getAllPets,
    getPetById,
    getCurrentUserPets,
    createPet,
    updatePet,
    deletePet,
  };
};
