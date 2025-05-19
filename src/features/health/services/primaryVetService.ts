
import { supabase } from "@/integrations/supabase/client";

/**
 * Sets a veterinarian as the primary vet for a pet owner
 */
export const setPrimaryVet = async (ownerId: string, vetId: string | null) => {
  try {
    const { data, error } = await supabase
      .from('pet_owners')
      .update({ primary_vet_id: vetId })
      .eq('id', ownerId);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error setting primary vet:', error);
    return { success: false, error };
  }
};

/**
 * Gets the primary vet details for a pet owner
 */
export const getPrimaryVet = async (ownerId: string) => {
  try {
    // First, get the primary_vet_id from pet_owners
    const { data: ownerData, error: ownerError } = await supabase
      .from('pet_owners')
      .select('primary_vet_id')
      .eq('id', ownerId)
      .single();
    
    if (ownerError) throw ownerError;
    
    // If no primary vet is set, return null
    if (!ownerData?.primary_vet_id) {
      return { success: true, data: null };
    }
    
    // Get the primary vet details
    const { data: vetData, error: vetError } = await supabase
      .from('veterinarians')
      .select(`
        id,
        specialization,
        profile_image_url,
        service_providers (
          business_name,
          provider_type,
          profiles (
            display_name
          )
        )
      `)
      .eq('id', ownerData.primary_vet_id)
      .single();
    
    if (vetError) throw vetError;
    
    return { success: true, data: vetData };
  } catch (error) {
    console.error('Error getting primary vet:', error);
    return { success: false, error };
  }
};
