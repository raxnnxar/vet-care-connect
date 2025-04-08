
import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../state/store';
import { 
  fetchVeterinarians, 
  fetchVetById, 
  searchVets,
  fetchTopRatedVets
} from '../store/vetsThunks';
import { vetsActions } from '../store/vetsSlice';
import { VetFilters } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

export const useVeterinarians = () => {
  const dispatch = useAppDispatch();
  const { veterinarians, currentVet, isLoading, error } = useAppSelector(state => state.vets);
  
  return {
    // State
    veterinarians,
    currentVet,
    isLoading,
    error,
    
    // Actions
    fetchVeterinarians: useCallback((options?: QueryOptions) => dispatch(fetchVeterinarians(options)), [dispatch]),
    fetchVetById: useCallback((id: string) => dispatch(fetchVetById(id)), [dispatch]),
    searchVets: useCallback((filters: VetFilters) => dispatch(searchVets(filters)), [dispatch]),
    fetchTopRatedVets: useCallback((limit: number = 5) => dispatch(fetchTopRatedVets(limit)), [dispatch]),
    clearErrors: useCallback(() => dispatch(vetsActions.clearErrors()), [dispatch]),
  };
};
