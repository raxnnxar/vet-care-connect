
/**
 * Custom hook for accessing and managing veterinarian data
 */
import { useState, useCallback } from 'react';
import { 
  getVeterinarians, 
  getVeterinarianById, 
  searchVeterinarians,
  getTopRatedVets
} from '../api/vetsApi';
import { Veterinarian, VetFilters } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

export const useVeterinarians = () => {
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [currentVet, setCurrentVet] = useState<Veterinarian | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all veterinarians with optional filtering
   */
  const fetchVeterinarians = useCallback(async (options?: QueryOptions) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getVeterinarians(options);
      
      if (error) throw error;
      setVeterinarians(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch veterinarians'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch a single veterinarian by ID
   */
  const fetchVetById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getVeterinarianById(id);
      
      if (error) throw error;
      setCurrentVet(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch veterinarian'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Search for veterinarians based on criteria
   */
  const searchVets = useCallback(async (filters: VetFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await searchVeterinarians(filters);
      
      if (error) throw error;
      setVeterinarians(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search veterinarians'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get top-rated veterinarians
   */
  const fetchTopRatedVets = useCallback(async (limit: number = 5) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getTopRatedVets(limit);
      
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch top-rated vets'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    veterinarians,
    currentVet,
    isLoading,
    error,
    fetchVeterinarians,
    fetchVetById,
    searchVets,
    fetchTopRatedVets
  };
};
