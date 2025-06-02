
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSelector } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { MapPin } from 'lucide-react';

const LocationSetupScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización');
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        toast.success('Ubicación detectada correctamente');
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('No se pudo obtener la ubicación. Verifica los permisos de tu navegador.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleFinishSetup = async () => {
    if (!address.trim()) {
      toast.error('Por favor, ingresa tu dirección');
      return;
    }

    if (!user?.id) {
      toast.error('Usuario no encontrado');
      return;
    }

    setIsSaving(true);

    try {
      const updateData: any = {
        address: address.trim(),
      };

      if (coordinates) {
        updateData.latitude = coordinates.lat;
        updateData.longitude = coordinates.lng;
      }

      const { error } = await supabase
        .from('pet_owners')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // También actualizar la tabla profiles con la dirección
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      toast.success('Configuración completada con éxito');
      navigate(ROUTES.OWNER);
    } catch (error) {
      console.error('Error al guardar la ubicación:', error);
      toast.error('Error al guardar la ubicación');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#79D0B8] py-8 px-4 flex flex-col">
      <div className="container mx-auto max-w-md flex-grow">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Ubicación – Dueño de mascota
          </h2>
          <p className="text-white/90 text-sm">
            Necesitamos conocer tu ubicación para brindarte el mejor servicio
          </p>
        </div>
        
        <div className="space-y-6 mb-24">
          <div className="space-y-2">
            <label htmlFor="address" className="block text-white font-medium">
              Dirección
            </label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ingresa tu dirección"
              className="bg-white/90 border-white"
            />
            <p className="text-white/80 text-sm">
              Esta información previene el abandono de mascotas y nos ayuda a contactar a los dueños en caso de ser necesario.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
              className="w-full py-3 bg-white/10 border-white text-white hover:bg-white/20 disabled:opacity-50"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {isGettingLocation ? 'Detectando ubicación...' : 'Usar mi ubicación actual'}
            </Button>

            {coordinates && (
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white text-sm font-medium mb-2">Ubicación detectada:</p>
                <p className="text-white/90 text-xs">
                  Latitud: {coordinates.lat.toFixed(6)}
                </p>
                <p className="text-white/90 text-xs">
                  Longitud: {coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Botón fijo en la parte inferior */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#79D0B8] shadow-lg">
        <div className="container mx-auto max-w-md">
          <Button
            onClick={handleFinishSetup}
            disabled={!address.trim() || isSaving}
            className="w-full py-4 bg-white text-[#79D0B8] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-lg font-semibold"
          >
            {isSaving ? 'Guardando...' : 'Finalizar configuración'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationSetupScreen;
