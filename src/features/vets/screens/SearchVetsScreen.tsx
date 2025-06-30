
import React, { useState, useEffect, useCallback } from 'react';
import { LayoutBase } from '@/frontend/navigation/components';
import { SearchIcon, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Badge } from '@/ui/atoms/badge';
import { supabase } from '@/integrations/supabase/client';
import { getUserLocation, calculateDistance } from '@/utils/distanceUtils';
import { toast } from 'sonner';
import FindVetsFiltersModal from '../components/FindVetsFiltersModal';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { Json } from '@/integrations/supabase/types';
import { useDebounce } from '@/hooks/use-debounce';

interface VetSearchResult {
  id: string;
  profile_image_url?: string;
  average_rating: number;
  total_reviews: number;
  specialization: Json;
  animals_treated: Json;
  categoria_precio: string;
  clinic_latitude: number;
  clinic_longitude: number;
}

interface SearchFilters {
  animals: string[];
  specialties: string[];
  priceCategories: string[];
  minRating: number;
  maxDistance: number; // in km
}

const SearchVetsScreen = () => {
  const [query, setQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [vets, setVets] = useState<VetSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    animals: [],
    specialties: [],
    priceCategories: [],
    minRating: 0,
    maxDistance: 20
  });
  
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  // Get user location on component mount
  useEffect(() => {
    const getLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };
    getLocation();
  }, []);

  // Fetch vets when location, query, or filters change
  useEffect(() => {
    if (userLocation) {
      fetchVets(true); // Reset pagination
    }
  }, [userLocation, debouncedQuery, filters]);

  const fetchVets = async (reset = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    const offset = reset ? 0 : currentOffset;
    
    try {
      const { data, error } = await supabase.rpc('search_veterinarians', {
        p_lat: userLocation?.latitude || null,
        p_lon: userLocation?.longitude || null,
        p_query: debouncedQuery || null,
        p_animals: filters.animals.length > 0 ? filters.animals : null,
        p_specialties: filters.specialties.length > 0 ? filters.specialties : null,
        p_price_cat: filters.priceCategories.length > 0 ? filters.priceCategories : null,
        p_rating_min: filters.minRating > 0 ? filters.minRating : null,
        p_max_dist_m: userLocation ? filters.maxDistance * 1000 : null,
        p_limit: 20,
        p_offset: offset
      });

      if (error) {
        throw error;
      }

      const newVets = data || [];
      
      if (reset) {
        setVets(newVets);
        setCurrentOffset(20);
      } else {
        setVets(prev => [...prev, ...newVets]);
        setCurrentOffset(prev => prev + 20);
      }
      
      setHasMore(newVets.length === 20);
    } catch (error: any) {
      console.error('Error searching veterinarians:', error);
      toast.error('Ocurrió un error al buscar veterinarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchVets(false);
    }
  };

  const handleFiltersApply = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleVetClick = (vetId: string) => {
    navigate(`/vets/${vetId}`);
  };

  const formatDistance = (vetLat: number, vetLon: number) => {
    if (!userLocation) return null;
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      vetLat,
      vetLon
    );
  };

  const formatSpecialization = (specializations: Json) => {
    if (!specializations) return "MEDICINA GENERAL";
    
    let specArray: string[] = [];
    if (Array.isArray(specializations)) {
      specArray = specializations as string[];
    } else if (typeof specializations === 'string') {
      specArray = [specializations];
    }
    
    if (specArray.length === 0) return "MEDICINA GENERAL";
    
    const primary = specArray[0].toUpperCase();
    return specArray.length > 1 ? `${primary} +${specArray.length - 1}` : primary;
  };

  const formatAnimalsTreated = (animals: Json) => {
    if (!animals) return "Trata: Animales domésticos";
    
    let animalsArray: string[] = [];
    if (Array.isArray(animals)) {
      animalsArray = animals as string[];
    } else if (typeof animals === 'string') {
      animalsArray = [animals];
    }
    
    if (animalsArray.length === 0) return "Trata: Animales domésticos";
    if (animalsArray.length <= 2) return `Trata: ${animalsArray.join(', ')}`;
    return `Trata: ${animalsArray[0]}, ${animalsArray[1]} +${animalsArray.length - 2}`;
  };

  const getPriceSymbol = (category: string) => {
    switch (category) {
      case 'economico': return '$';
      case 'moderado': return '$$';
      case 'premium': return '$$$';
      default: return '$';
    }
  };

  const removeFilter = (type: keyof SearchFilters, value?: string) => {
    const newFilters = { ...filters };
    
    if (type === 'minRating') {
      newFilters.minRating = 0;
    } else if (type === 'maxDistance') {
      newFilters.maxDistance = 20;
    } else if (value && Array.isArray(newFilters[type])) {
      (newFilters[type] as string[]) = (newFilters[type] as string[]).filter(item => item !== value);
    }
    
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      animals: [],
      specialties: [],
      priceCategories: [],
      minRating: 0,
      maxDistance: 20
    });
  };

  const getActiveFiltersCount = () => {
    return filters.animals.length + 
           filters.specialties.length + 
           filters.priceCategories.length + 
           (filters.minRating > 0 ? 1 : 0);
  };

  const hasActiveFilters = getActiveFiltersCount() > 0;

  return (
    <LayoutBase
      header={
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="p-1" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Busca veterinario..."
                className="w-full rounded-xl border border-gray-300 focus:border-[#79D0B8] focus:ring-[#79D0B8]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        </div>
      }
    >
      <div className="p-4 pb-20">
        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.animals.map(animal => (
                <Badge 
                  key={animal} 
                  variant="secondary"
                  className="bg-[#79D0B8]/20 text-[#79D0B8] hover:bg-[#79D0B8]/30 cursor-pointer flex items-center gap-1"
                  onClick={() => removeFilter('animals', animal)}
                >
                  {animal}
                  <X size={12} />
                </Badge>
              ))}
              {filters.specialties.map(specialty => (
                <Badge 
                  key={specialty} 
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer flex items-center gap-1"
                  onClick={() => removeFilter('specialties', specialty)}
                >
                  {specialty}
                  <X size={12} />
                </Badge>
              ))}
              {filters.priceCategories.map(price => (
                <Badge 
                  key={price} 
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer flex items-center gap-1"
                  onClick={() => removeFilter('priceCategories', price)}
                >
                  {getPriceSymbol(price)}
                  <X size={12} />
                </Badge>
              ))}
              {filters.minRating > 0 && (
                <Badge 
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer flex items-center gap-1"
                  onClick={() => removeFilter('minRating')}
                >
                  ★{filters.minRating}+
                  <X size={12} />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Filter Button */}
        <Button
          onClick={() => setIsFiltersOpen(true)}
          className="w-full mb-6 bg-[#79D0B8] hover:bg-[#5FBFB3] text-white"
        >
          Filtrar {hasActiveFilters && `(${getActiveFiltersCount()})`}
        </Button>

        {/* Results */}
        {isLoading && vets.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : vets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No encontramos veterinarios con esos filtros</p>
            <p className="text-gray-400 text-sm mb-4">Intenta ajustar tu búsqueda</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearAllFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              {vets.length} veterinario{vets.length !== 1 ? 's' : ''} encontrado{vets.length !== 1 ? 's' : ''}
            </p>
            
            {vets.map((vet) => (
              <Card
                key={vet.id}
                className="p-4 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow rounded-xl border border-gray-200"
                onClick={() => handleVetClick(vet.id)}
              >
                <Avatar className="h-16 w-16 mr-3 shadow-sm">
                  {vet.profile_image_url ? (
                    <AvatarImage src={vet.profile_image_url} alt="Veterinario" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-[#79D0B8] text-white">
                      VET
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-[#1F2937] text-base">Dr. Veterinario</h3>
                  <p className="text-sm text-gray-500 font-medium">{formatSpecialization(vet.specialization)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatAnimalsTreated(vet.animals_treated)}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-sm font-medium">{vet.average_rating.toFixed(1)}</span>
                      <span className="ml-1 text-xs text-gray-500">({vet.total_reviews} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {getPriceSymbol(vet.categoria_precio)}
                      </span>
                      {userLocation && (
                        <span className="text-xs text-gray-500">
                          {formatDistance(vet.clinic_latitude, vet.clinic_longitude)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : 'Cargar más'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Filters Modal */}
        <FindVetsFiltersModal
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          filters={filters}
          onApply={handleFiltersApply}
        />
      </div>
    </LayoutBase>
  );
};

export default SearchVetsScreen;
