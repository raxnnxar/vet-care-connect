
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export const useAppLocationUpdate = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { userRole } = useUser();

  useEffect(() => {
    const updateLocationOnAppStart = async () => {
      // Only for pet owners
      if (!user?.id || userRole !== 'pet_owner') return;

      try {
        // Check if user has location sharing enabled
        const { data, error } = await supabase
          .from('pet_owners')
          .select('share_location')
          .eq('id', user.id)
          .single();

        if (error || !data?.share_location) return;

        // If enabled, request and update location with better error handling
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              try {
                await supabase
                  .from('pet_owners')
                  .update({ latitude, longitude })
                  .eq('id', user.id);
                
                console.log('Location updated on app start:', { latitude, longitude });
              } catch (error) {
                console.error('Error updating location on app start:', error);
              }
            },
            (error) => {
              console.error('Error getting location on app start:', error);
              // Don't show toast on app start failures to avoid annoying users
            },
            {
              enableHighAccuracy: false, // Less accurate but more reliable
              timeout: 10000,
              maximumAge: 600000 // 10 minutes
            }
          );
        }
      } catch (error) {
        console.error('Error checking location sharing setting:', error);
      }
    };

    updateLocationOnAppStart();
  }, [user?.id, userRole]);
};
