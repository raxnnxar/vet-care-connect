
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvcGMiLCJhIjoiY21iZmJjM3p1MW9xczJrcTE1ZWozejV0MyJ9.yZoV_UkRYXdeVObla8Ky7A';

interface VetLocationSectionProps {
  address?: string;
  latitude?: number;
  longitude?: number;
}

const VetLocationSection: React.FC<VetLocationSectionProps> = ({
  address,
  latitude,
  longitude
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Debug logs
  console.log('VetLocationSection props:', { address, latitude, longitude });

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) {
      console.log('Missing map requirements:', { hasContainer: !!mapContainer.current, latitude, longitude });
      return;
    }

    try {
      console.log('Initializing map with coordinates:', [longitude, latitude]);
      
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 15
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add static marker for the vet location
      marker.current = new mapboxgl.Marker({ color: '#79D0B8' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      try {
        // Clean up marker first
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
        // Clean up map
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      } catch (error) {
        console.error('Error cleaning up map:', error);
      }
    };
  }, [latitude, longitude]);

  // Don't render if no location data
  if (!address || !latitude || !longitude) {
    console.log('VetLocationSection not rendering due to missing data:', { address, latitude, longitude });
    return null;
  }

  console.log('VetLocationSection rendering with data:', { address, latitude, longitude });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Ubicación</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Address */}
          <div className="flex items-start space-x-3">
            <MapPin size={20} className="text-[#79D0B8] mt-1 flex-shrink-0" />
            <p className="text-gray-700 flex-1">{address}</p>
          </div>

          {/* Map */}
          <div className="mt-4">
            <div 
              ref={mapContainer} 
              className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VetLocationSection;
