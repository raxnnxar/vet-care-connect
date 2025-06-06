import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePrimaryGrooming = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const setAsPrimary = async (groomingId: string) => {
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
      // Get the current primary grooming for the user
      const { data: ownerData, error: ownerError } = await supabase
        .from('pet_owners')
        .select('primary_grooming_id')
        .eq('id', user.id)
        .single();
        
      if (ownerError) throw ownerError;
      
      // If the grooming is already the primary, remove it (set to null)
      // Otherwise, set the new grooming as primary
      const newPrimaryGroomingId = ownerData.primary_grooming_id === groomingId ? null : groomingId;
      
      // Update the owner's primary_grooming_id
      const { error: updateError } = await supabase
        .from('pet_owners')
        .update({ primary_grooming_id: newPrimaryGroomingId })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      toast({
        title: "Éxito",
        description: newPrimaryGroomingId 
          ? "Estética de confianza actualizada" 
          : "Estética de confianza removida",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error("Error setting primary grooming:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la estética de confianza",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    setAsPrimary,
    loading
  };
};
