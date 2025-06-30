
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import VetCard from '../components/VetCard';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { useDebounce } from '@/hooks/use-debounce';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VetFilters {
  animals: string[];
  specialties: string[];
  price_cat: string[];
  rating_min: number | null;
  max_dist_m: number | null;
}

interface Veterinarian {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  specialization: string[];
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
  animalsTreated: string[];
}

const SearchVetScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<VetFilters>({
    animals: [],
    specialties: [],
    price_cat: [],
    rating_min: null,
    max_dist_m: null
  });
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationOffset, setPaginationOffset] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
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
              // Fallback location (could be app's default or null)
              setUserLocation(null);
            }
          );
        }
      } catch (error) {
        console.warn('Geolocation not supported:', error);
        setUserLocation(null);
      }
    };

    getUserLocation();
  }, []);

  // Search function
  const searchVets = useCallback(async (resetOffset = false) => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);
    
    const offset = resetOffset ? 0 : paginationOffset;
    
    try {
      const { data, error: rpcError } = await supabase.rpc('search_veterinarians', {
        p_lat: userLocation.lat,
        p_lon: userLocation.lon,
        p_query: debouncedQuery || null,
        p_animals: filters.animals.length > 0 ? filters.animals : null,
        p_specialties: filters.specialties.length > 0 ? filters.specialties : null,
        p_price_cat: filters.price_cat.length > 0 ? filters.price_cat : null,
        p_rating_min: filters.rating_min,
        p_max_dist_m: filters.max_dist_m,
        p_limit: 20,
        p_offset: offset
      });

      if (rpcError) {
        throw rpcError;
      }

      // Transform data to match VetCard expectations
      const transformedVets = (data || []).map((vet: any) => ({
        id: vet.id,
        name: `Dr. ${vet.id}`, // Placeholder - would need actual name from profiles
        firstName: 'Dr.',
        lastName: vet.id,
        specialization: vet.specialization || [],
        imageUrl: vet.profile_image_url || '',
        rating: vet.average_rating || 0,
        reviewCount: vet.total_reviews || 0,
        distance: '1.2 km', // Would calculate from lat/lon
        animalsTreated: vet.animals_treated || []
      }));

      if (resetOffset) {
        setVets(transformedVets);
        setPaginationOffset(20);
      } else {
        setVets(prev => [...prev, ...transformedVets]);
        setPaginationOffset(prev => prev + 20);
      }
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
  }, [userLocation, debouncedQuery, filters, paginationOffset, toast]);

  // Search when query or filters change
  useEffect(() => {
    if (userLocation) {
      searchVets(true);
    }
  }, [debouncedQuery, filters, userLocation]);

  const handleBackPress = () => {
    navigate(-1);
  };

  const handleVetPress = (vetId: string) => {
    navigate(`/owner/vets/${vetId}`);
  };

  const handleFiltersApply = (appliedFilters: VetFilters) => {
    setFilters(appliedFilters);
    setFiltersOpen(false);
  };

  const handleLoadMore = () => {
    if (!loading) {
      searchVets(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* AppBar */}
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
              placeholder="Busca veterinario…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="border-0 shadow-none focus:ring-0 text-base"
            />
          </div>
        </div>
      </div>

      {/* Filter Button */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <Button
          onClick={() => setFiltersOpen(true)}
          className="w-full bg-[#79D0B8] hover:bg-[#79D0B8]/90 text-white flex items-center justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtrar
        </Button>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        {loading && vets.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner />
          </div>
        ) : vets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-500 mb-4">No hay veterinarios que coincidan</p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  animals: [],
                  specialties: [],
                  price_cat: [],
                  rating_min: null,
                  max_dist_m: null
                });
                setQuery('');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {vets.map((vet) => (
              <VetCard
                key={vet.id}
                vet={vet}
                onClick={handleVetPress}
              />
            ))}
            {loading && (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
            {vets.length > 0 && vets.length % 20 === 0 && !loading && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                >
                  Cargar más
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Modal - Would need to import and use FindVetsFiltersModal */}
      {/* This would be imported from the existing modal component */}
    </div>
  );
};

export default SearchVetScreen;
