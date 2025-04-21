import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import {
  fetchPets,
  fetchPetById,
  addPet,
  modifyPet,
  removePet,
  fetchPetsByOwner,
  uploadPetProfilePicture
} from '../store/petsThunks';
import { petsActions } from '../store/petsSlice';
import { CreatePetData, UpdatePetData, PetFilters, Pet } from '../types';
import { useAuth } from '../../auth/hooks/useAuth';

export const usePets = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { pets, currentPet, isLoading, error } = useAppSelector(state => state.pets);
  
  const getAllPets = useCallback((filters?: PetFilters) => {
    return dispatch(fetchPets(filters));
  }, [dispatch]);
  
  const getPetById = useCallback((id: string) => {
    return dispatch(fetchPetById(id));
  }, [dispatch]);
  
  const createPet = useCallback(async (petData: CreatePetData): Promise<Pet | null> => {
    // Inject the owner_id if available and not provided
    if (user?.id && !petData.owner_id) {
      petData.owner_id = user.id;
    }
    
    try {
      console.log('Creating pet with data:', petData);
      // Call the addPet thunk and properly handle the promise
      const resultAction = await dispatch(addPet(petData));
      
      // Extract the pet data from the resolved action
      if (addPet.fulfilled.match(resultAction)) {
        // Return the pet data directly
        return resultAction.payload as Pet;
      } else {
        console.error('Failed to create pet:', resultAction.error);
        return null;
      }
    } catch (error) {
      console.error('Error creating pet:', error);
      return null;
    }
  }, [dispatch, user]);
  
  const updatePet = useCallback((id: string, petData: UpdatePetData) => {
    return dispatch(modifyPet({ id, petData }));
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
  
  const uploadProfilePicture = useCallback(async (petId: string, file: File): Promise<string | null> => {
    try {
      // Pass the arguments in the format expected by the thunk
      const resultAction = await dispatch(uploadPetProfilePicture({ petId, file }));
      
      if (uploadPetProfilePicture.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;
        return url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  }, [dispatch]);
  
  const clearError = useCallback(() => {
    dispatch(petsActions.clearPetError());
  }, [dispatch]);
  
  const resetState = useCallback(() => {
    dispatch(petsActions.resetPetState());
  }, [dispatch]);
  
  return {
    // State
    pets,
    currentPet,
    isLoading,
    error,
    
    // Actions
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    getPetsByOwner,
    getCurrentUserPets,
    uploadProfilePicture,
    clearError,
    resetState,
  };
};
