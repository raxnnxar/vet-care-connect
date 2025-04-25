import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/state/store';
import { petsActions } from '../store/petsSlice';
import { useBasicPetOperations } from './useBasicPetOperations';
import { usePetFileUploads } from './usePetFileUploads';

export const usePets = () => {
  const dispatch = useAppDispatch();
  const { pets, currentPet, isLoading, error } = useAppSelector(state => state.pets);
  const basicOperations = useBasicPetOperations();
  const fileUploads = usePetFileUploads();
  
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
    
    // Basic operations
    ...basicOperations,
    
    // File uploads
    ...fileUploads,
    
    // State management
    clearError,
    resetState,
  };
};

export default usePets;
