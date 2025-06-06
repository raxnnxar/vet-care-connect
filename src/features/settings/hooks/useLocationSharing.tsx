
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useLocationSharing = () => {
  const [shareLocation, setShareLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();

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
      } else {
        toast({
          title: "Configuración actualizada",
          description: "Compartir ubicación desactivado",
        });
      }
    } catch (error) {
      console.error('Error updating location sharing:', error);
      toast({
        title: "Error",
        description: "Error al actualizar la configuración",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Request and update current location with better error handling
  const requestCurrentLocation = async () => {
    if (!user?.id) return;

    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        toast({
          title: "Error",
          description: "Tu navegador no soporta geolocalización",
          variant: "destructive",
        });
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
            toast({
              title: "Configuración actualizada",
              description: "Ubicación activada y guardada correctamente",
            });
            resolve();
          } catch (error) {
            console.error('Error updating location:', error);
            toast({
              title: "Error",
              description: "Error al guardar la ubicación",
              variant: "destructive",
            });
            reject(error);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'No se pudo obtener tu ubicación';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permisos de ubicación denegados. Por favor, permite el acceso a tu ubicación en la configuración del navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Tu ubicación no está disponible en este momento';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado al obtener la ubicación';
              break;
          }
          
          toast({
            title: "Error de ubicación",
            description: errorMessage,
            variant: "destructive",
          });
          reject(error);
        },
        {
          enableHighAccuracy: false, // Less accurate but more reliable
          timeout: 15000,
          maximumAge: 600000 // 10 minutes
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
