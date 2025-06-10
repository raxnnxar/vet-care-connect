
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { EditableSection } from '@/features/vets/components/profile/EditableSection';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token (same as in VetLocationSetupScreen)
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvcGMiLCJhIjoiY21iZmJjM3p1MW9xczJrcTE1ZWozejV0MyJ9.yZoV_UkRYXdeVObla8Ky7A';

interface GroomingLocationSectionProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedLocation: string;
  setEditedLocation: (location: string) => void;
  editedCoordinates: { lat: number; lng: number } | null;
  setEditedCoordinates: (coords: { lat: number; lng: number } | null) => void;
}

const GroomingLocationSection: React.FC<GroomingLocationSectionProps> = ({
  location,
  latitude,
  longitude,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedLocation,
  setEditedLocation,
  editedCoordinates,
  setEditedCoordinates
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Initialize map when editing starts
  useEffect(() => {
    if (!isEditing || !mapContainer.current) return;

    // Default coordinates (Mexico City) or existing coordinates
    const defaultLat = editedCoordinates?.lat || latitude || 19.4326;
    const defaultLng = editedCoordinates?.lng || longitude || -99.1332;

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
        setEditedCoordinates({ lat: lngLat.lat, lng: lngLat.lng });
        
        // Optional: Reverse geocoding to update address
        reverseGeocode(lngLat.lat, lngLat.lng);
      }
    });

    // Set initial coordinates
    setEditedCoordinates({ lat: defaultLat, lng: defaultLng });

    return () => {
      map.current?.remove();
    };
  }, [isEditing]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}&language=es`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        setEditedLocation(data.features[0].place_name);
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
        setEditedCoordinates({ lat: latitude, lng: longitude });
        
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
    setEditedLocation(value);
    
    // Optional: Forward geocoding when user types
    if (value.length > 3) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${mapboxgl.accessToken}&country=MX&language=es&limit=1`
        );
        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setEditedCoordinates({ lat, lng });
          
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

  return (
    <EditableSection
      title="Ubicación"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {isEditing ? (
        <div className="space-y-4">
          {/* Address Input */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección de la estética
            </label>
            <Input
              id="address"
              type="text"
              value={editedLocation}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Ingresa tu dirección"
              className="w-full"
            />
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
          {editedCoordinates && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Coordenadas:</strong> {editedCoordinates.lat.toFixed(6)}, {editedCoordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {location ? (
            <div className="flex items-start space-x-3">
              <MapPin size={20} className="text-[#79D0B8] mt-1" />
              <div className="flex-1">
                <p className="text-gray-700">{location}</p>
                {latitude && longitude && (
                  <p className="text-sm text-gray-500 mt-1">
                    Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay ubicación registrada</p>
          )}
        </div>
      )}
    </EditableSection>
  );
};

export default GroomingLocationSection;
