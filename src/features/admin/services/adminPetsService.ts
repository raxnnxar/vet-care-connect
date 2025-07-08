
import { supabase } from '@/integrations/supabase/client';

export interface Pet {
  id: string;
  name: string;
  species: string;
  owner_email: string;
  owner_name: string;
}

export const fetchPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select(`
      id,
      name,
      species,
      owner_id
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Get owner information for each pet
  const petsWithOwners = await Promise.all(
    (data || []).map(async (pet) => {
      const { data: ownerData } = await supabase
        .from('profiles')
        .select('email, display_name')
        .eq('id', pet.owner_id)
        .single();

      return {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        owner_email: ownerData?.email || 'Sin email',
        owner_name: ownerData?.display_name || 'Sin nombre'
      };
    })
  );
  
  return petsWithOwners;
};
