
import React, { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1pbGlvcGMiLCJhIjoiY21iZmJjM3p1MW9xczJrcTE1ZWozejV0MyJ9.yZoV_UkRYXdeVObla8Ky7A';

interface GroomingLocationSectionProps {
  location: string;
  latitude: number;
  longitude: number;
}

const GroomingLocationSection: React.FC<GroomingLocationSectionProps> = ({
  location,
  latitude,
  longitude
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !latitude || !longitude) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add static marker for the grooming location
    new mapboxgl.Marker({ color: '#79D0B8' })
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude]);

  // Don't render if no location data
  if (!location || !latitude || !longitude) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-[#79D0B8]/10 rounded-lg">
          <MapPin className="w-5 h-5 text-[#79D0B8]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>
      </div>
      
      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-start space-x-3">
          <MapPin size={20} className="text-[#79D0B8] mt-1 flex-shrink-0" />
          <p className="text-gray-700 flex-1">{location}</p>
        </div>

        {/* Map */}
        <div className="mt-4">
          <div 
            ref={mapContainer} 
            className="w-full h-64 rounded-lg border border-gray-200 overflow-hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default GroomingLocationSection;
