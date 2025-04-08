
import { AppDispatch } from '../../../state/store';
import { petsActions } from './petsSlice';
import { 
  getPets, 
  getPetById, 
  createPet, 
  updatePet, 
  deletePet, 
  getPetsByOwner 
} from '../api/petsApi';
import { CreatePetData, UpdatePetData, PetFilters } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

/**
 * Fetch all pets with optional filtering
 */
export const fetchPets = (filters?: PetFilters) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const options: QueryOptions = { 
      filters: filters as Record<string, any> 
    };
    
    const { data, error } = await getPets(options);
    
    if (error) throw new Error(error.message || 'Failed to fetch pets');
    
    dispatch(petsActions.fetchPetsSuccess(data || []));
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Fetch a single pet by ID
 */
export const fetchPetById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await getPetById(id);
    
    if (error) throw new Error(error.message || 'Failed to fetch pet');
    if (!data) throw new Error('Pet not found');
    
    dispatch(petsActions.fetchPetSuccess(data));
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Add a new pet
 */
export const addPet = (petData: CreatePetData) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await createPet(petData);
    
    if (error) throw new Error(error.message || 'Failed to add pet');
    if (!data) throw new Error('Pet creation returned no data');
    
    dispatch(petsActions.addPetSuccess(data));
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Update an existing pet
 */
export const modifyPet = (id: string, petData: UpdatePetData) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await updatePet(id, petData);
    
    if (error) throw new Error(error.message || 'Failed to update pet');
    if (!data) throw new Error('Pet update returned no data');
    
    dispatch(petsActions.updatePetSuccess(data));
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Remove a pet
 */
export const removePet = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { error } = await deletePet(id);
    
    if (error) throw new Error(error.message || 'Failed to delete pet');
    
    dispatch(petsActions.deletePetSuccess(id));
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};

/**
 * Fetch pets by owner ID
 */
export const fetchPetsByOwner = (ownerId: string) => async (dispatch: AppDispatch) => {
  dispatch(petsActions.requestStarted());
  
  try {
    const { data, error } = await getPetsByOwner(ownerId);
    
    if (error) throw new Error(error.message || 'Failed to fetch owner\'s pets');
    
    dispatch(petsActions.fetchPetsSuccess(data || []));
  } catch (err) {
    dispatch(petsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
  }
};
