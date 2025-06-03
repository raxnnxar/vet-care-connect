import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Settings } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/ui/molecules/card';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationError(null);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('No se pudo obtener tu ubicación');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
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
    new mapboxgl.Marker({ color: '#79D0B8' })
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
  }, [userLocation, veterinarians]);

  const handleGoToSettings = () => {
    // This would typically open device settings or show location permission dialog
    getUserLocation();
  };

  const handleViewProfile = (vetId: string) => {
    window.open(`/owner/vets/${vetId}`, '_self');
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

  if (locationError) {
    return (
      <div className="rounded-lg overflow-hidden">
        <div className="bg-[#5FBFB3]/5 p-4">
          <h2 className="text-lg font-semibold mb-2">Todo para tu mascota cerca de ti</h2>
          <div className="relative bg-gray-100 h-64 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="text-orange-500 mb-2">
                <Navigation size={32} />
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">
                Activa tu ubicación para ver servicios cercanos a ti
              </p>
              <Button
                onClick={handleGoToSettings}
                variant="outline"
                size="sm"
                className="bg-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Activar ubicación
              </Button>
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
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden"
          />
          
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
