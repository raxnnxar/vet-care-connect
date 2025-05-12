
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Veterinarian {
  id: string;
  profile_image_url?: string;
  bio?: string;
  specialization?: string[];
  average_rating?: number;
  total_reviews?: number;
  animals_treated?: string[];
  services_offered?: Array<{
    id: string;
    name: string;
    description?: string;
    price?: number;
  }>;
  availability?: Record<string, any>;
  emergency_services?: boolean;
  years_of_experience?: number;
  languages_spoken?: string[];
  profile?: {
    first_name: string;
    last_name: string;
  };
}

export const useVeterinariansData = (searchTerm = '') => {
  const fetchVeterinarians = async () => {
    let query = supabase
      .from('veterinarians')
      .select(`
        *,
        profile:profiles(first_name, last_name)
      `)
      .order('average_rating', { ascending: false });
      
    if (searchTerm) {
      // Using ilike for case-insensitive search in PostgreSQL
      // Note: This is a simplification and might need adjustment based on your schema
      query = query.or(`specialization.ilike.%${searchTerm}%,profile.first_name.ilike.%${searchTerm}%,profile.last_name.ilike.%${searchTerm}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching veterinarians:', error);
      throw new Error('Error fetching veterinarians');
    }
    
    // Process and format data for the UI
    return data?.map(vet => ({
      ...vet,
      // Format name from profile relation - use safe access with null checks
      name: vet.profile && typeof vet.profile === 'object' && vet.profile !== null ? 
        `${vet.profile.first_name || ''} ${vet.profile.last_name || ''}`.trim() : 'Veterinario',
      // Use a default image if none provided
      imageUrl: vet.profile_image_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
      // Extract first specialization for the card display
      specialization: Array.isArray(vet.specialization) ? 
        vet.specialization.map(spec => translateSpecialization(String(spec))).join(', ') : '',
      // Ensure rating is a number
      rating: vet.average_rating || 4.5,
      reviewCount: vet.total_reviews || 0,
      // Mock distance data (would need geolocation integration for real distance)
      distance: generateRandomDistance()
    }));
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['veterinarians', searchTerm],
    queryFn: fetchVeterinarians,
  });

  return {
    veterinarians: data || [],
    isLoading,
    error
  };
};

// Helper function to translate specialization codes to Spanish display names
const translateSpecialization = (code: string): string => {
  const specializations = {
    'surgery': 'Cirugía',
    'dermatology': 'Dermatología',
    'internal_medicine': 'Medicina interna',
    'cardiology': 'Cardiología',
    'oncology': 'Oncología',
    'neurology': 'Neurología',
    'ophthalmology': 'Oftalmología',
    'dentistry': 'Odontología',
    'nutrition': 'Nutrición',
    'behavior': 'Comportamiento',
    'emergency': 'Emergencias'
  };
  
  return specializations[code] || code.charAt(0).toUpperCase() + code.slice(1).replace('_', ' ');
};

// Helper function to generate random distance for demo purposes
const generateRandomDistance = () => {
  return `${(Math.random() * 5).toFixed(1)} km`;
};

// Find primary vet logic - this would need to be implemented based on your app's business logic
export const usePrimaryVeterinarian = (userId: string | null) => {
  // In a real app, this would fetch the user's primary vet from the database
  const { veterinarians, isLoading } = useVeterinariansData();
  
  return {
    primaryVet: veterinarians[0], // Using first vet as primary for demo
    isLoading
  };
};
