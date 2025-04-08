
/**
 * Custom hook for accessing and managing pet data
 */
import { useState, useCallback } from 'react';
import { 
  getPets, 
  getPetById, 
  createPet, 
  updatePet, 
  deletePet,
  getPetsByOwner
} from '../api/petsApi';
import { Pet, CreatePetData, UpdatePetData, PetFilters } from '../types';
import { QueryOptions } from '../../../core/api/apiClient';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all pets with optional filtering
   */
  const fetchPets = useCallback(async (filters?: PetFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const options: QueryOptions = { 
        filters: filters as Record<string, any>
      };
      
      const { data, error } = await getPets(options);
      
      if (error) throw error;
      setPets(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pets'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch a single pet by ID
   */
  const fetchPetById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getPetById(id);
      
      if (error) throw error;
      setCurrentPet(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pet'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new pet
   */
  const addPet = useCallback(async (petData: CreatePetData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await createPet(petData);
      
      if (error) throw error;
      setPets(prevPets => [...prevPets, data as Pet]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add pet'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing pet
   */
  const modifyPet = useCallback(async (id: string, petData: UpdatePetData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await updatePet(id, petData);
      
      if (error) throw error;
      
      setPets(prevPets => 
        prevPets.map(pet => pet.id === id ? { ...pet, ...data } as Pet : pet)
      );
      
      if (currentPet?.id === id) {
        setCurrentPet({ ...currentPet, ...data } as Pet);
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update pet'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentPet]);

  /**
   * Remove a pet
   */
  const removePet = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await deletePet(id);
      
      if (error) throw error;
      
      setPets(prevPets => prevPets.filter(pet => pet.id !== id));
      
      if (currentPet?.id === id) {
        setCurrentPet(null);
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete pet'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentPet]);

  /**
   * Fetch pets by owner
   */
  const fetchPetsByOwner = useCallback(async (ownerId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getPetsByOwner(ownerId);
      
      if (error) throw error;
      setPets(data || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch owner\'s pets'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    pets,
    currentPet,
    isLoading,
    error,
    fetchPets,
    fetchPetById,
    fetchPetsByOwner,
    addPet,
    modifyPet,
    removePet
  };
};
