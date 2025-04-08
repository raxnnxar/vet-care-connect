
import { AppDispatch } from '../../../state/store';
import { vetsActions } from './vetsSlice';
import { 
  getVeterinarians, 
  getVeterinarianById, 
  searchVeterinarians, 
  getTopRatedVets 
} from '../api/vetsApi';
import { VetFilters } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

/**
 * Fetch all veterinarians with optional filtering
 */
export const fetchVeterinarians = (options?: QueryOptions) => async (dispatch: AppDispatch) => {
  dispatch(vetsActions.requestStarted());
  
  try {
    const { data, error } = await getVeterinarians(options);
    
    if (error) throw new Error(error.message || 'Failed to fetch veterinarians');
    
    dispatch(vetsActions.fetchVetsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(vetsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Fetch a single veterinarian by ID
 */
export const fetchVetById = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(vetsActions.requestStarted());
  
  try {
    const { data, error } = await getVeterinarianById(id);
    
    if (error) throw new Error(error.message || 'Failed to fetch veterinarian');
    if (!data) throw new Error('Veterinarian not found');
    
    dispatch(vetsActions.fetchVetSuccess(data));
    return data;
  } catch (err) {
    dispatch(vetsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Search for veterinarians based on criteria
 */
export const searchVets = (filters: VetFilters) => async (dispatch: AppDispatch) => {
  dispatch(vetsActions.requestStarted());
  
  try {
    const { data, error } = await searchVeterinarians(filters);
    
    if (error) throw new Error(error.message || 'Failed to search veterinarians');
    
    dispatch(vetsActions.fetchVetsSuccess(data || []));
    return data;
  } catch (err) {
    dispatch(vetsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};

/**
 * Get top-rated veterinarians
 */
export const fetchTopRatedVets = (limit: number = 5) => async (dispatch: AppDispatch) => {
  dispatch(vetsActions.requestStarted());
  
  try {
    const { data, error } = await getTopRatedVets(limit);
    
    if (error) throw new Error(error.message || 'Failed to fetch top-rated vets');
    
    return data;
  } catch (err) {
    dispatch(vetsActions.requestFailed(err instanceof Error ? err.message : 'An unknown error occurred'));
    return null;
  }
};
