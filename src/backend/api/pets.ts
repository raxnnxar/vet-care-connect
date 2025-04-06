
import petsData from '../data/pets.json';
import { Pet } from '../../frontend/pets/types';

export const getPets = async (ownerId: string): Promise<Pet[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return petsData.filter(pet => pet.ownerId === ownerId);
};

export const getPet = async (petId: string): Promise<Pet | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pet = petsData.find(p => p.id === petId);
  return pet || null;
};

export const addPet = async (petData: Omit<Pet, 'id'>): Promise<Pet> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would add to the database
  // Here we just return with a generated ID
  const newPet = {
    ...petData,
    id: `pet${Date.now()}`
  };
  
  return newPet;
};

export const updatePet = async (petId: string, petData: Partial<Pet>): Promise<Pet> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingPet = petsData.find(p => p.id === petId);
  
  if (!existingPet) {
    throw new Error('Pet not found');
  }
  
  // In a real app, this would update the database
  // Here we just return the updated pet
  return {
    ...existingPet,
    ...petData
  };
};
