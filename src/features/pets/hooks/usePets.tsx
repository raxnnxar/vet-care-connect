
import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import { 
  fetchPets, 
  fetchPetById, 
  addPet, 
  modifyPet, 
  removePet, 
  fetchPetsByOwner 
} from '../store/petsThunks';
import { petsActions } from '../store/petsSlice';
import { CreatePetData, UpdatePetData, PetFilters, Pet } from '../types';

export const usePets = () => {
  const dispatch = useAppDispatch();
  const { pets, currentPet, isLoading, error } = useAppSelector(state => state.pets);
  
  return {
    // State
    pets,
    currentPet,
    isLoading,
    error,
    
    // Actions
    fetchPets: useCallback((filters?: PetFilters) => dispatch(fetchPets(filters)), [dispatch]),
    fetchPetById: useCallback((id: string) => dispatch(fetchPetById(id)), [dispatch]),
    fetchPetsByOwner: useCallback((ownerId: string) => dispatch(fetchPetsByOwner(ownerId)), [dispatch]),
    addPet: useCallback((petData: CreatePetData) => dispatch(addPet(petData)), [dispatch]),
    modifyPet: useCallback((id: string, petData: UpdatePetData) => dispatch(modifyPet(id, petData)), [dispatch]),
    removePet: useCallback((id: string) => dispatch(removePet(id)), [dispatch]),
    clearErrors: useCallback(() => dispatch(petsActions.clearErrors()), [dispatch]),
  };
};
