
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { ROUTES } from '@/frontend/shared/constants/routes';
import { supabase } from '@/integrations/supabase/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvcGMiLCJhIjoiY21iZmJjM3p1MW9xczJrcTE1ZWozejV0MyJ9.yZoV_UkRYXdeVObla8Ky7A';

const GroomingLocationSetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Default coordinates (Mexico City)
    const defaultLat = 19.4326;
    const defaultLng = -99.1332;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [defaultLng, defaultLat],
      zoom: 13
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    // Add draggable marker
    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([defaultLng, defaultLat])
      .addTo(map.current);

    // Update coordinates when marker is dragged
    marker.current.on('dragend', () => {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        setCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
        
        // Optional: Reverse geocoding to update address
        reverseGeocode(lngLat.lat, lngLat.lng);
      }
    });

    // Set initial coordinates
    setCoordinates({ lat: defaultLat, lng: defaultLng });

    return () => {
      map.current?.remove();
    };
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&language=es`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        setAddress(data.features[0].place_name);
      }
    } catch (error) {
      console.error('Error with reverse geocoding:', error);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Tu navegador no soporta geolocalización');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        // Update map and marker
        if (map.current && marker.current) {
          map.current.setCenter([longitude, latitude]);
          marker.current.setLngLat([longitude, latitude]);
        }
        
        // Get address for this location
        reverseGeocode(latitude, longitude);
        
        setIsGettingLocation(false);
        toast.success('Ubicación obtenida correctamente');
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('No se pudo obtener tu ubicación');
        setIsGettingLocation(false);
      }
    );
  };

  const handleAddressChange = async (value: string) => {
    setAddress(value);
    
    // Optional: Forward geocoding when user types
    if (value.length > 3) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${mapboxgl.accessToken}&country=MX&language=es&limit=1`
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
        console.error('Error with forward geocoding:', error);
      }
    }
  };

  const handleFinishSetup = async () => {
    if (!user?.id) {
      toast.error('No se pudo identificar al usuario');
      return;
    }

    if (!address.trim()) {
      toast.error('Por favor ingresa la dirección de tu estética');
      return;
    }

    if (!coordinates) {
      toast.error('Por favor selecciona la ubicación en el mapa');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('pet_grooming')
        .update({
          location: address.trim(),
          latitude: coordinates.lat,
          longitude: coordinates.lng
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Ubicación de la estética guardada correctamente');
      // Redirigir al dashboard o home después de completar la configuración
      navigate('/');
    } catch (error: any) {
      console.error('Error saving grooming location:', error);
      toast.error(`Error al guardar la ubicación: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#79D0B8] to-[#5FBFB3] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ubicación de tu Estética
          </h1>
          <p className="text-white/80">
            Establece la ubicación donde atenderás a las mascotas
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Address Input */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección de tu estética
            </label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Ingresa tu dirección"
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Esto nos ayuda a mostrar tu estética en el mapa y facilitar que los clientes te encuentren.
            </p>
          </div>

          {/* Current Location Button */}
          <Button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isGettingLocation}
            variant="outline"
            className="w-full"
          >
            {isGettingLocation ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Obteniendo ubicación...
              </>
            ) : (
              <>
                <Navigation className="h-4 w-4 mr-2" />
                Usar mi ubicación actual
              </>
            )}
          </Button>

          {/* Map Container */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4 inline mr-1" />
              Selecciona la ubicación en el mapa
            </label>
            <div 
              ref={mapContainer} 
              className="w-full h-64 rounded-lg border border-gray-300 overflow-hidden"
            />
            <p className="text-xs text-gray-500">
              Arrastra el pin para ajustar la ubicación exacta
            </p>
          </div>

          {/* Coordinates Display */}
          {coordinates && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Coordenadas:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* Finish Setup Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleFinishSetup}
              disabled={isLoading || !address.trim() || !coordinates}
              className="bg-[#79D0B8] hover:bg-[#5FBFB3] px-8 py-3"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Finalizar configuración
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroomingLocationSetupScreen;
