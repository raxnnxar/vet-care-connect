import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePrimaryVet = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const setAsPRIMARY = async (vetId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Debe iniciar sesión para realizar esta acción",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    try {
      // Get the current primary vet for the user
      const { data: ownerData, error: ownerError } = await supabase
        .from('pet_owners')
        .select('primary_vet_id')
        .eq('id', user.id)
        .single();
        
      if (ownerError) throw ownerError;
      
      // If the vet is already the primary vet, remove it (set to null)
      // Otherwise, set the new vet as primary
      const newPrimaryVetId = ownerData.primary_vet_id === vetId ? null : vetId;
      
      // Update the owner's primary_vet_id
      const { error: updateError } = await supabase
        .from('pet_owners')
        .update({ primary_vet_id: newPrimaryVetId })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Error setting primary vet:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el veterinario principal",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    setAsPRIMARY,
    loading
  };
};
