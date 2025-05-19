
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useToast } from '@/hooks/use-toast';
import { setPrimaryVet, getPrimaryVet } from '../services/primaryVetService';

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
      const result = await setPrimaryVet(user.id, vetId);
      
      if (result.success) {
        toast({
          title: "¡Éxito!",
          description: "Veterinario establecido como principal correctamente",
          variant: "default"
        });
        return true;
      } else {
        throw new Error("No se pudo establecer el veterinario principal");
      }
    } catch (error) {
      console.error("Error setting primary vet:", error);
      toast({
        title: "Error",
        description: "No se pudo establecer el veterinario principal",
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
