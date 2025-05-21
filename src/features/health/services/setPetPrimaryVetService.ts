
import { supabase } from "@/integrations/supabase/client";

/**
 * Sets or removes a veterinarian as the primary vet for a specific pet
 */
export const setPetPrimaryVet = async (petId: string, vetId: string | null) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .update({ primary_vet_id: vetId })
      .eq('id', petId);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating pet primary vet:', error);
    return { success: false, error };
  }
};

/**
 * Gets all pets that have the specified veterinarian as their primary vet
 */
export const getPetsWithPrimaryVet = async (ownerId: string, vetId: string) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('id, name, profile_picture_url, species')
      .eq('owner_id', ownerId)
      .eq('primary_vet_id', vetId);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error getting pets with primary vet:', error);
    return { success: false, error };
  }
};
