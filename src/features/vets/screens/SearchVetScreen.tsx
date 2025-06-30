
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import VetCard from '@/features/health/components/VetCard';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { useDebounce } from '@/hooks/use-debounce';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SearchVet {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  specialization: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
  clinic: string;
  address: string;
  availableDays: string[];
  description: string;
  phone: string;
  emergencyServices: boolean;
  animalsTreated: string[];
}

const SearchVetScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [vets, setVets] = useState<SearchVet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  // Get user location on mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              });
            },
            (error) => {
              console.warn('Location access denied:', error);
              // Use default location if geolocation fails (Mexico City)
              setUserLocation({ lat: 19.4326, lon: -99.1332 });
            }
          );
        } else {
          setUserLocation({ lat: 19.4326, lon: -99.1332 });
        }
      } catch (error) {
        console.warn('Geolocation not supported:', error);
        setUserLocation({ lat: 19.4326, lon: -99.1332 });
      }
    };

    getUserLocation();
  }, []);

  const searchVets = useCallback(async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try using the RPC function for proper search
      const { data: rpcData, error: rpcError } = await supabase.rpc('search_veterinarians', {
        p_lat: userLocation.lat,
        p_lon: userLocation.lon,
        p_query: debouncedQuery || null,
        p_limit: 20,
        p_offset: 0
      });

      let data = rpcData;
      
      // If RPC fails, fallback to the view
      if (rpcError) {
        console.warn('RPC search failed, falling back to view:', rpcError);
        const { data: viewData, error: viewError } = await supabase
          .from('v_veterinarians_search')
          .select('*')
          .limit(20);
          
        if (viewError) throw viewError;
        data = viewData;
      }

      // Transform data to match SearchVet interface
      const transformedVets: SearchVet[] = (data || []).map((vet: any) => {
        const fullName = `Dr. ${vet.id.substring(0, 8)}`;
        const nameParts = fullName.split(' ');
        
        return {
          id: vet.id,
          name: fullName,
          firstName: nameParts[0] || 'Dr.',
          lastName: nameParts.slice(1).join(' ') || vet.id.substring(0, 8),
          specialization: Array.isArray(vet.specialization) ? vet.specialization : [],
          imageUrl: vet.profile_image_url || '/placeholder.svg',
          rating: vet.average_rating || 0,
          reviewCount: vet.total_reviews || 0,
          distance: userLocation ? '1.2 km' : 'N/A', // Calculate real distance if needed
          clinic: 'Clínica Veterinaria',
          address: 'Dirección de la clínica',
          availableDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
          description: 'Veterinario especializado en el cuidado de mascotas',
          phone: '+52 55 1234 5678',
          emergencyServices: vet.emergency_services || false,
          animalsTreated: Array.isArray(vet.animals_treated) ? vet.animals_treated : []
        };
      });

      setVets(transformedVets);
    } catch (err) {
      console.error('Search error:', err);
      setError('Ocurrió un error al buscar veterinarios');
      toast({
        title: "Error",
        description: "Ocurrió un error al buscar veterinarios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userLocation, debouncedQuery, toast]);

  // Search when location is available and query changes
  useEffect(() => {
    if (userLocation) {
      searchVets();
    }
  }, [userLocation, searchVets]);

  const handleBackPress = () => {
    navigate('/owner/salud');
  };

  const handleVetPress = (vetId: string) => {
    navigate(`/owner/vets/${vetId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackPress}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Busca veterinario por nombre o especialidad..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="border-0 shadow-none focus:ring-0 text-base"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={searchVets}
            >
              Intentar de nuevo
            </Button>
          </div>
        ) : vets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-500 mb-4">No se encontraron veterinarios</p>
            <Button
              variant="outline"
              onClick={searchVets}
            >
              Buscar nuevamente
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {vets.map((vet) => (
              <VetCard
                key={vet.id}
                vet={vet}
                onClick={() => handleVetPress(vet.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchVetScreen;
