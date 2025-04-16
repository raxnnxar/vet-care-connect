
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '../../../state/store';
import { petsActions } from './petsSlice';
import { petsApi } from '../api/petsApi';
import { CreatePetData, UpdatePetData, PetFilters, Pet } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';
import { toast } from 'sonner';

/**
 * Fetch all pets with optional filtering
 */
export const fetchPets = (filters?: PetFilters) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const options: QueryOptions = { 
      filters: filters as Record<string, any> 
    };
    
    const { data, error } = await petsApi.getPets(options);
    
    if (error) throw new Error(error.message || 'Failed to fetch pets');
    
    dispatch(petsActions.fetchPetsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Fetch a single pet by ID
 */
export const fetchPetById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await petsApi.getPetById(id);
    
    if (error) throw new Error(error.message || 'Failed to fetch pet');
    if (!data) throw new Error('Pet not found');
    
    dispatch(petsActions.fetchPetSuccess(data));
    return data;
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Add a new pet
 */
export const addPet = createAsyncThunk(
  'pets/addPet',
  async (petData: CreatePetData, { rejectWithValue, dispatch }) => {
    try {
      // Process medical history data before sending it to the API
      if (petData.medicalHistory) {
        // Ensure medications and surgeries are properly stringified
        if (petData.medicalHistory.current_medications && 
            Array.isArray(petData.medicalHistory.current_medications)) {
          petData.medicalHistory.current_medications = 
            JSON.stringify(petData.medicalHistory.current_medications);
        }
        
        if (petData.medicalHistory.previous_surgeries && 
            Array.isArray(petData.medicalHistory.previous_surgeries)) {
          petData.medicalHistory.previous_surgeries = 
            JSON.stringify(petData.medicalHistory.previous_surgeries);
        }
      }
      
      console.log('Sending pet data to API:', petData);
      const { data, error } = await petsApi.createPet(petData);
      
      if (error) {
        console.error('Error adding pet:', error);
        toast.error(`Error al agregar mascota: ${error.message || 'Error desconocido'}`);
        return rejectWithValue(error.message || 'Failed to add pet');
      }
      
      if (!data) {
        toast.error('Error al agregar mascota: No se devolvieron datos');
        return rejectWithValue('Pet creation returned no data');
      }
      
      // Dispatch success action to update Redux state
      dispatch(petsActions.addPetSuccess(data));
      toast.success('Mascota agregada exitosamente');
      return data as Pet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error adding pet:', err);
      toast.error(`Error al agregar mascota: ${errorMessage}`);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update an existing pet
 */
export const modifyPet = (id: string, petData: UpdatePetData) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await petsApi.updatePet(id, petData);
    
    if (error) throw new Error(error.message || 'Failed to update pet');
    if (!data) throw new Error('Pet update returned no data');
    
    dispatch(petsActions.updatePetSuccess(data));
    toast.success('Mascota actualizada exitosamente');
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Error al actualizar mascota');
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Remove a pet
 */
export const removePet = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { error } = await petsApi.deletePet(id);
    
    if (error) throw new Error(error.message || 'Failed to delete pet');
    
    dispatch(petsActions.deletePetSuccess(id));
    toast.success('Mascota eliminada exitosamente');
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Error al eliminar mascota');
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Fetch pets by owner ID
 */
export const fetchPetsByOwner = (ownerId: string) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await petsApi.getPetsByOwner(ownerId);
    
    if (error) throw new Error(error.message || 'Failed to fetch owner\'s pets');
    
    dispatch(petsActions.fetchPetsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Upload pet profile picture
 */
export const uploadPetProfilePicture = createAsyncThunk(
  'pets/uploadProfilePicture',
  async (args: { petId: string; file: File }, { rejectWithValue, dispatch }) => {
    const { petId, file } = args;
    
    try {
      const { data, error } = await petsApi.uploadPetProfilePicture(petId, file);
      
      if (error) {
        toast.error('Error al subir la foto de perfil');
        return rejectWithValue(error.message || 'Failed to upload pet profile picture');
      }
      
      if (!data) {
        toast.error('Error: No se recibieron datos de la foto');
        return rejectWithValue('Photo upload returned no data');
      }
      
      // Update pet with new profile picture URL in the store
      dispatch(petsActions.updatePetProfilePictureSuccess({ id: petId, url: data.publicUrl }));
      toast.success('Foto de perfil actualizada exitosamente');
      
      return { url: data.publicUrl, id: petId };
    } catch (err) {
      toast.error('Error al subir la foto de mascota');
      return rejectWithValue(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }
);
