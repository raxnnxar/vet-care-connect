
import { useCallback } from 'react';
import { useAppDispatch } from '@/state/store';
import { fetchPets, fetchPetById, addPet, modifyPet, removePet, fetchPetsByOwner } from '../store/petsThunks';
import { CreatePetData, UpdatePetData, PetFilters, Pet } from '../types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBasicPetOperations = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  const getAllPets = useCallback((filters?: PetFilters) => {
    return dispatch(fetchPets(filters));
  }, [dispatch]);
  
  const getPetById = useCallback((id: string) => {
    return dispatch(fetchPetById(id));
  }, [dispatch]);
  
  const createPet = useCallback(async (petData: CreatePetData): Promise<Pet | null> => {
    try {
      if (user?.id && !petData.owner_id) {
        petData.owner_id = user.id;
      }
      
      const { data: ownerExists, error: ownerCheckError } = await supabase
        .from('pet_owners')
        .select('id')
        .eq('id', petData.owner_id)
        .maybeSingle();
      
      if (!ownerExists || ownerCheckError) {
        const { error: createOwnerError } = await supabase
          .from('pet_owners')
          .insert({ id: petData.owner_id });
          
        if (createOwnerError) {
          console.error('Failed to create owner record:', createOwnerError);
          toast.error('Error al configurar el perfil de dueño');
          return null;
        }
      }
      
      const petPhotoFile = petData.petPhotoFile;
      const petDataForSubmit = { ...petData };
      delete petDataForSubmit.petPhotoFile;
      
      const resultAction = await dispatch(addPet(petDataForSubmit));
      
      if (addPet.fulfilled.match(resultAction)) {
        return resultAction.payload as Pet;
      }
      
      console.error('Failed to create pet:', resultAction.error);
      toast.error(`Error al crear mascota: ${resultAction.error.message || 'Error desconocido'}`);
      return null;
    } catch (error) {
      console.error('Error creating pet:', error);
      toast.error('Error al crear mascota');
      return null;
    }
  }, [dispatch, user]);
  
  const updatePet = useCallback(async (id: string, petData: UpdatePetData) => {
    try {
      const cleanPetData = { ...petData };
      
      if ('petPhotoFile' in cleanPetData) {
        delete cleanPetData.petPhotoFile;
      }
      
      if ('medicalHistory' in cleanPetData) {
        delete cleanPetData.medicalHistory;
      }
      
      const resultAction = await dispatch(modifyPet({ id, petData: cleanPetData }));
      
      if (modifyPet.fulfilled.match(resultAction)) {
        return { payload: resultAction.payload };
      }
      
      console.error('Failed to update pet:', resultAction.error);
      toast.error(`Error al actualizar mascota: ${resultAction.error.message || 'Error desconocido'}`);
      return null;
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Error al actualizar mascota');
      return null;
    }
  }, [dispatch]);
  
  const deletePet = useCallback((id: string) => {
    return dispatch(removePet(id));
  }, [dispatch]);
  
  const getPetsByOwner = useCallback((ownerId: string) => {
    return dispatch(fetchPetsByOwner(ownerId));
  }, [dispatch]);
  
  const getCurrentUserPets = useCallback(() => {
    if (user?.id) {
      return dispatch(fetchPetsByOwner(user.id));
    }
    return Promise.resolve();
  }, [dispatch, user]);

  return {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    getPetsByOwner,
    getCurrentUserPets,
  };
};
