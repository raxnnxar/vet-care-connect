
import vetsData from '../data/vets.json';
import { Veterinarian } from '../../features/vets/types';

export const getVets = async (): Promise<Veterinarian[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return vetsData;
};

export const getVet = async (vetId: string): Promise<Veterinarian | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const vet = vetsData.find(v => v.id === vetId);
  return vet || null;
};

export const searchVets = async (query: string): Promise<Veterinarian[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const lowercasedQuery = query.toLowerCase();
  
  return vetsData.filter(vet => 
    vet.name.toLowerCase().includes(lowercasedQuery) || 
    vet.specialization.some(spec => spec.toLowerCase().includes(lowercasedQuery)) ||
    vet.clinic.toLowerCase().includes(lowercasedQuery)
  );
};
