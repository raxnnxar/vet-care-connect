
import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/state/store';
import { petsActions } from '../store/petsSlice';
import { useBasicPetOperations } from './useBasicPetOperations';
import { usePetFileUploads } from './usePetFileUploads';
import { supabase } from '@/integrations/supabase/client';

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
  
  const uploadVaccineDoc = async (petId: string, file: File): Promise<string | null> => {
    try {
      console.log('Uploading vaccine document for pet:', petId);
      
      const { data, error } = await supabase.storage
        .from('pet-vaccine-documents')
        .upload(`${petId}/${Date.now()}_vaccine.${file.name.split('.').pop()}`, file);
      
      if (error) {
        console.error('Error uploading vaccine document:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('pet-vaccine-documents')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading vaccine document:', error);
      return null;
    }
  };

  return {
    pets,
    currentPet,
    isLoading,
    error,
    
    ...basicOperations,
    
    ...fileUploads,
    
    clearError,
    resetState,
    uploadVaccineDoc,
  };
};

export default usePets;
