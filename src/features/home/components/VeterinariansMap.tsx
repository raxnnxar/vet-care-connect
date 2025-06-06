
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/ui/molecules/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvcGMiLCJhIjoiY21iZmJjM3p1MW9xczJrcTE1ZWozejV0MyJ9.yZoV_UkRYXdeVObla8Ky7A';

interface Veterinarian {
  id: string;
  clinic_latitude: number;
  clinic_longitude: number;
  clinic_address: string;
  service_providers?: {
    business_name?: string;
    profiles?: {
      display_name?: string;
    };
  };
}

const VeterinariansMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  // Default location (Mexico City) as fallback
  const defaultLocation = { lat: 19.4326, lng: -99.1332 };

  // Fetch veterinarians from Supabase
  const fetchVeterinarians = async () => {
    try {
      const { data, error } = await supabase
        .from('veterinarians')
        .select(`
          id,
          clinic_latitude,
          clinic_longitude,
          clinic_address,
          service_providers (
            business_name,
            profiles (
              display_name
            )
          )
        `)
        .not('clinic_latitude', 'is', null)
        .not('clinic_longitude', 'is', null);

      if (error) throw error;
      setVeterinarians(data || []);
    } catch (error) {
      console.error('Error fetching veterinarians:', error);
    }
  };

  // Get user's current location with better error handling
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización');
      setUserLocation(defaultLocation);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationError(null);
        setLocationPermissionDenied(false);
        setIsLoading(false);
        toast({
          title: "Ubicación detectada",
          description: "Tu ubicación se ha detectado correctamente",
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'No se pudo obtener tu ubicación';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permisos de ubicación denegados';
            setLocationPermissionDenied(true);
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        
        setLocationError(errorMessage);
        setUserLocation(defaultLocation); // Use default location as fallback
        setIsLoading(false);
        
        toast({
          title: "Error de ubicación",
          description: `${errorMessage}. Mostrando ubicación por defecto.`,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: false, // Less accurate but more reliable
        timeout: 15000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };

  // Initialize map
  useEffect(() => {
    getUserLocation();
    fetchVeterinarians();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [userLocation.lng, userLocation.lat],
      zoom: 13
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    const userMarkerColor = locationPermissionDenied ? '#FF8A65' : '#79D0B8';
    new mapboxgl.Marker({ color: userMarkerColor })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);

    // Add veterinarian markers
    veterinarians.forEach((vet) => {
      if (!map.current) return;

      const marker = new mapboxgl.Marker({ color: '#FF8A65' })
        .setLngLat([vet.clinic_longitude, vet.clinic_latitude])
        .addTo(map.current);

      // Add click event to marker
      marker.getElement().addEventListener('click', () => {
        setSelectedVet(vet);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [userLocation, veterinarians, locationPermissionDenied]);

  const handleRequestPermission = () => {
    // Reset states and try again
    setLocationError(null);
    setLocationPermissionDenied(false);
    setIsLoading(true);
    getUserLocation();
  };

  const handleViewProfile = (vetId: string) => {
    if (!vetId) {
      console.error('No veterinarian ID provided');
      toast({
        title: "Error",
        description: "No se pudo acceder al perfil del veterinario",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Navigating to vet profile:', vetId);
    navigate(`/owner/vets/${vetId}`);
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#5FBFB3]/5 p-4">
          <h2 className="text-lg font-semibold mb-2">Todo para tu mascota cerca de ti</h2>
          <div className="relative bg-gray-100 h-64 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-[#5FBFB3] animate-pulse">
                <MapPin size={32} />
              </div>
              <p className="text-sm text-gray-600 mt-2">Cargando mapa...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="bg-[#5FBFB3]/5 p-4">
        <h2 className="text-lg font-semibold mb-2">Todo para tu mascota cerca de ti</h2>
        
        {/* Show location status */}
        {locationError && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-700">{locationError}</span>
          </div>
        )}
        
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden"
          />
          
          {/* Location permission button */}
          {(locationError || locationPermissionDenied) && (
            <div className="absolute top-4 left-4 z-10">
              <Button
                onClick={handleRequestPermission}
                variant="outline"
                size="sm"
                className="bg-white shadow-md"
              >
                <Navigation className="h-4 w-4 mr-2" />
                {locationPermissionDenied ? 'Permitir ubicación' : 'Reintentar ubicación'}
              </Button>
            </div>
          )}
          
          {/* Veterinarian details popup */}
          {selectedVet && (
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {selectedVet.service_providers?.business_name || 
                         selectedVet.service_providers?.profiles?.display_name || 
                         'Veterinario'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedVet.clinic_address}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedVet(null)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleViewProfile(selectedVet.id)}
                      size="sm"
                      className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
                    >
                      Ver perfil
                    </Button>
                    <Button
                      onClick={() => handleGetDirections(selectedVet.clinic_address)}
                      variant="outline"
                      size="sm"
                    >
                      Cómo llegar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeterinariansMap;
