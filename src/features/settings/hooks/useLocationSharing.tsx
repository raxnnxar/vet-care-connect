
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useLocationSharing = () => {
  const [shareLocation, setShareLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  // Load initial share_location setting
  useEffect(() => {
    const loadLocationSetting = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('pet_owners')
          .select('share_location')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading location setting:', error);
          return;
        }

        setShareLocation(data?.share_location || false);
      } catch (error) {
        console.error('Error loading location setting:', error);
      }
    };

    loadLocationSetting();
  }, [user?.id]);

  // Update location sharing setting
  const updateLocationSharing = async (enabled: boolean) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pet_owners')
        .update({ share_location: enabled })
        .eq('id', user.id);

      if (error) throw error;

      setShareLocation(enabled);
      
      if (enabled) {
        // If enabling, request location immediately
        await requestCurrentLocation();
        toast.success('Compartir ubicación activado');
      } else {
        toast.success('Compartir ubicación desactivado');
      }
    } catch (error) {
      console.error('Error updating location sharing:', error);
      toast.error('Error al actualizar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  // Request and update current location
  const requestCurrentLocation = async () => {
    if (!user?.id) return;

    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error('Tu navegador no soporta geolocalización');
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const { error } = await supabase
              .from('pet_owners')
              .update({ 
                latitude, 
                longitude 
              })
              .eq('id', user.id);

            if (error) throw error;
            
            console.log('Location updated:', { latitude, longitude });
            resolve();
          } catch (error) {
            console.error('Error updating location:', error);
            reject(error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('No se pudo obtener tu ubicación');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  return {
    shareLocation,
    isLoading,
    updateLocationSharing,
    requestCurrentLocation
  };
};
