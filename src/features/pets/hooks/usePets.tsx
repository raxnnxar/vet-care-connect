
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    try {
      // Inject the owner_id if available and not provided
      if (user?.id && !petData.owner_id) {
        petData.owner_id = user.id;
      }
      
      console.log('Creating pet with owner ID:', petData.owner_id);
      console.log('Creating pet with data:', petData);
      
      // Check if the user exists in the pet_owners table first
      const { data: ownerExists, error: ownerCheckError } = await supabase
        .from('pet_owners')
        .select('id')
        .eq('id', petData.owner_id)
        .single();
      
      // If owner doesn't exist, create an entry in the pet_owners table first
      if (!ownerExists || ownerCheckError) {
        console.log('Owner not found in pet_owners table, creating entry...');
        const { error: createOwnerError } = await supabase
          .from('pet_owners')
          .insert({ id: petData.owner_id });
          
        if (createOwnerError) {
          console.error('Failed to create owner record:', createOwnerError);
          toast.error('Error al configurar el perfil de dueño');
          return null;
        }
        console.log('Owner record created successfully');
      }
      
      // Extract the photo file from the data
      const petPhotoFile = petData.petPhotoFile;
      const petDataForSubmit = { ...petData };
      delete petDataForSubmit.petPhotoFile;
      
      // Call the addPet thunk and properly handle the promise
      const resultAction = await dispatch(addPet(petDataForSubmit));
      
      // Extract the pet data from the resolved action
      if (addPet.fulfilled.match(resultAction)) {
        console.log('Pet created successfully:', resultAction.payload);
        
        // If we have a photo file, upload it
        if (petPhotoFile && resultAction.payload?.id) {
          console.log('Uploading pet photo for:', resultAction.payload.id);
          const photoResult = await dispatch(uploadPetProfilePicture({
            petId: resultAction.payload.id,
            file: petPhotoFile
          }));
          
          if (uploadPetProfilePicture.fulfilled.match(photoResult)) {
            console.log('Photo uploaded successfully:', photoResult.payload);
            // Update the pet object with the photo URL
            const petWithPhoto = {
              ...resultAction.payload,
              profile_picture_url: photoResult.payload.url
            };
            return petWithPhoto;
          }
        }
        
        // Return the pet data directly
        return resultAction.payload as Pet;
      } else {
        console.error('Failed to create pet:', resultAction.error);
        toast.error(`Error al crear mascota: ${resultAction.error.message || 'Error desconocido'}`);
        return null;
      }
    } catch (error) {
      console.error('Error creating pet:', error);
      toast.error('Error al crear mascota');
      return null;
    }
  }, [dispatch, user]);
  
  const updatePet = useCallback(async (id: string, petData: UpdatePetData) => {
    try {
      console.log('Updating pet with ID:', id);
      console.log('Update data:', petData);
      
      // Clean up data before sending to Supabase
      const cleanPetData = { ...petData };
      
      // Remove non-database fields
      if ('petPhotoFile' in cleanPetData) {
        delete cleanPetData.petPhotoFile;
      }
      
      if ('medicalHistory' in cleanPetData) {
        delete cleanPetData.medicalHistory;
      }
      
      const resultAction = await dispatch(modifyPet({ id, petData: cleanPetData }));
      
      if (modifyPet.fulfilled.match(resultAction)) {
        console.log('Pet updated successfully:', resultAction.payload);
        return { payload: resultAction.payload };
      } else {
        console.error('Failed to update pet:', resultAction.error);
        toast.error(`Error al actualizar mascota: ${resultAction.error.message || 'Error desconocido'}`);
        return null;
      }
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

export default usePets;
