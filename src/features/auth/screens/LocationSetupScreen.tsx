
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSelector } from '@/state/store';
import { supabase } from '@/integrations/supabase/client';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { MapPin, Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvcGMiLCJhIjoiY21iZmJjM3p1MW9xczJrcTE1ZWozejV0MyJ9.yZoV_UkRYXdeVObla8Ky7A';

const LocationSetupScreen = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-99.1332, 19.4326], // Mexico City default
      zoom: 13,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Create draggable marker
    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([-99.1332, 19.4326])
      .addTo(map.current);

    // Handle marker drag
    marker.current.on('dragend', async () => {
      if (!marker.current) return;
      
      const lngLat = marker.current.getLngLat();
      setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}&language=es`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].place_name);
        }
      } catch (error) {
        console.error('Error en geocodificación inversa:', error);
      }
    });

    map.current.on('load', () => {
      setIsLoadingMap(false);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización');
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        // Update map and marker
        if (map.current && marker.current) {
          map.current.setCenter([longitude, latitude]);
          marker.current.setLngLat([longitude, latitude]);
        }
        
        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}&language=es`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            setAddress(data.features[0].place_name);
          }
        } catch (error) {
          console.error('Error en geocodificación inversa:', error);
        }
        
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

  const handleAddressChange = async (newAddress: string) => {
    setAddress(newAddress);
    
    // If we have an address, try to geocode it
    if (newAddress.trim().length > 3) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(newAddress)}.json?access_token=${mapboxgl.accessToken}&country=mx&language=es`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setCoordinates({ lat, lng });
          
          // Update map and marker
          if (map.current && marker.current) {
            map.current.setCenter([lng, lat]);
            marker.current.setLngLat([lng, lat]);
          }
        }
      } catch (error) {
        console.error('Error en geocodificación:', error);
      }
    }
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

      // También actualizar la tabla profiles con la fecha de actualización
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
            Ubicación
          </h2>
          <p className="text-white/90 text-sm">
            Necesitamos conocer tu ubicación para brindarte el mejor servicio
          </p>
        </div>
        
        <div className="space-y-6 mb-24">
          {/* Address Input */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-white font-medium">
              Dirección
            </label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Ingresa tu dirección"
              className="bg-white/90 border-white"
            />
            <p className="text-white/80 text-sm">
              Esta información nos permite ayudarte a encontrar veterinarios cercanos y nos ayuda a contactarte si algo sucede con tu mascota.
            </p>
          </div>

          {/* Current Location Button */}
          <Button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="w-full py-3 bg-white/10 border-white text-white hover:bg-white/20 disabled:opacity-50"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            {isGettingLocation ? 'Detectando ubicación...' : 'Usar mi ubicación actual'}
          </Button>

          {/* Map Container */}
          <div className="space-y-4">
            <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
              {isLoadingMap && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                  <Loader2 className="w-6 h-6 animate-spin text-[#79D0B8]" />
                </div>
              )}
              <div ref={mapContainer} className="w-full h-full" />
            </div>
            
            <p className="text-white/80 text-xs text-center">
              Arrastra el pin para ajustar tu ubicación exacta
            </p>
          </div>

          {/* Coordinates Display */}
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
      
      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#79D0B8] shadow-lg">
        <div className="container mx-auto max-w-md">
          <Button
            onClick={handleFinishSetup}
            disabled={!address.trim() || isSaving}
            className="w-full py-4 bg-white text-[#79D0B8] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-lg font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Finalizar configuración'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationSetupScreen;
