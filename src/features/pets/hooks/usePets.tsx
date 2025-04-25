import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import {
  fetchPets,
  fetchPetById,
  addPet,
  modifyPet,
  removePet,
  fetchPetsByOwner,
  uploadPetProfilePicture,
  uploadVaccineDocument
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
      if (user?.id && !petData.owner_id) {
        petData.owner_id = user.id;
      }
      
      console.log('Creating pet with owner ID:', petData.owner_id);
      console.log('Creating pet with data:', petData);
      
      const { data: ownerExists, error: ownerCheckError } = await supabase
        .from('pet_owners')
        .select('id')
        .eq('id', petData.owner_id)
        .single();
      
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
      
      const petPhotoFile = petData.petPhotoFile;
      const petDataForSubmit = { ...petData };
      delete petDataForSubmit.petPhotoFile;
      
      const resultAction = await dispatch(addPet(petDataForSubmit));
      
      if (addPet.fulfilled.match(resultAction)) {
        console.log('Pet created successfully:', resultAction.payload);
        
        if (petPhotoFile && resultAction.payload?.id) {
          console.log('Uploading pet photo for:', resultAction.payload.id);
          const photoResult = await dispatch(uploadPetProfilePicture({
            petId: resultAction.payload.id,
            file: petPhotoFile
          }));
          
          if (uploadPetProfilePicture.fulfilled.match(photoResult)) {
            console.log('Photo uploaded successfully:', photoResult.payload);
            const petWithPhoto = {
              ...resultAction.payload,
              profile_picture_url: photoResult.payload.url
            };
            return petWithPhoto;
          }
        }
        
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
      
      const cleanPetData = { ...petData };
      
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
      const resultAction = await dispatch(uploadPetProfilePicture({ petId, file }));
      
      if (uploadPetProfilePicture.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;
        console.log('Profile picture uploaded successfully, URL:', url);
        return url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return null;
    }
  }, [dispatch]);
  
  const uploadVaccineDoc = useCallback(async (petId: string, file: File): Promise<string | null> => {
    try {
      if (!petId) {
        console.error('Missing pet ID for vaccine document upload');
        toast.error('Error: ID de mascota no disponible');
        return null;
      }
      
      console.log('Uploading vaccine document for pet:', petId);
      console.log('File to upload:', file.name, file.type, file.size);
      
      const resultAction = await dispatch(uploadVaccineDocument({ petId, file }));
      
      if (uploadVaccineDocument.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;
        console.log('Vaccine document uploaded successfully, URL:', url);
        return url;
      } else {
        console.error('Vaccine document upload failed:', resultAction.error);
        toast.error('Error al subir el documento de vacunas: ' + (resultAction.error?.message || 'Error desconocido'));
        return null;
      }
    } catch (error: any) {
      console.error('Error uploading vaccine document:', error);
      toast.error('Error al subir el documento de vacunas: ' + (error?.message || 'Error desconocido'));
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
    pets,
    currentPet,
    isLoading,
    error,
    
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet,
    getPetsByOwner,
    getCurrentUserPets,
    uploadProfilePicture,
    uploadVaccineDoc,
    clearError,
    resetState,
  };
};

export default usePets;
