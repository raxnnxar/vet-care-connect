
import React, { useState, useEffect } from 'react';
import { LayoutBase, NavbarInferior } from '@/frontend/navigation/components';
import { SearchIcon, ArrowLeft, Filter, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { supabase } from '@/integrations/supabase/client';
import { getUserLocation, calculateDistance } from '@/utils/distanceUtils';
import { toast } from 'sonner';
import FindVetsFiltersModal from '../components/FindVetsFiltersModal';
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';

interface VetSearchResult {
  id: string;
  profile_image_url?: string;
  average_rating: number;
  total_reviews: number;
  specialization: string[];
  animals_treated: string[];
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

const FindVetsScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [vets, setVets] = useState<VetSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    animals: [],
    specialties: [],
    priceCategories: [],
    minRating: 0,
    maxDistance: 20
  });
  
  const navigate = useNavigate();

  // Get user location on component mount
  useEffect(() => {
    const getLocation = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        // Perform initial search with user location
        performSearch('', location, filters);
      } else {
        toast.error('No se pudo obtener la ubicación');
        // Perform search without location
        performSearch('', null, filters);
      }
    };
    
    getLocation();
  }, []);

  const performSearch = async (
    query: string, 
    location: { latitude: number; longitude: number } | null,
    searchFilters: SearchFilters
  ) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('search_veterinarians', {
        p_lat: location?.latitude || null,
        p_lon: location?.longitude || null,
        p_query: query || null,
        p_animals: searchFilters.animals.length > 0 ? searchFilters.animals : null,
        p_specialties: searchFilters.specialties.length > 0 ? searchFilters.specialties : null,
        p_price_cat: searchFilters.priceCategories.length > 0 ? searchFilters.priceCategories : null,
        p_rating_min: searchFilters.minRating > 0 ? searchFilters.minRating : null,
        p_max_dist_m: location ? searchFilters.maxDistance * 1000 : null, // Convert km to meters
        p_limit: 50,
        p_offset: 0
      });

      if (error) {
        throw error;
      }

      setVets(data || []);
    } catch (error: any) {
      console.error('Error searching veterinarians:', error);
      toast.error('Error al buscar veterinarios');
      setVets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm, userLocation, filters);
  };

  const handleFiltersApply = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
    performSearch(searchTerm, userLocation, newFilters);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleVetClick = (vetId: string) => {
    navigate(`/vets/${vetId}`);
  };

  const formatDistance = (vetLat: number, vetLon: number) => {
    if (!userLocation) return 'Ubicación no disponible';
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      vetLat,
      vetLon
    );
  };

  const formatSpecialization = (specializations: string[]) => {
    if (!specializations || specializations.length === 0) {
      return "MEDICINA GENERAL";
    }
    
    const primary = specializations[0].toUpperCase();
    
    if (specializations.length > 1) {
      return `${primary} +${specializations.length - 1}`;
    }
    
    return primary;
  };

  const formatAnimalsTreated = (animals: string[]) => {
    if (!animals || animals.length === 0) {
      return "Trata: Animales domésticos";
    }
    
    if (animals.length <= 2) {
      return `Trata: ${animals.join(', ')}`;
    }
    
    return `Trata: ${animals[0]}, ${animals[1]} +${animals.length - 2}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriceSymbol = (category: string) => {
    switch (category) {
      case 'economico': return '$';
      case 'moderado': return '$$';
      case 'premium': return '$$$';
      default: return '$';
    }
  };

  return (
    <LayoutBase
      header={
        <div className="flex items-center justify-between p-4 bg-[#79D0B8]">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-white p-1 mr-2" 
              onClick={handleGoBack}
            >
              <ArrowLeft size={24} />
            </Button>
            <h1 className="text-xl font-medium text-white">Buscar Veterinarios</h1>
          </div>
        </div>
      }
      footer={<NavbarInferior activeTab="home" />}
    >
      <div className="p-4 pb-20">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Buscar por nombre o especialidad"
                className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 focus:border-[#79D0B8] focus:ring-[#79D0B8]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="px-4 py-3 rounded-full border border-gray-300"
              onClick={() => setIsFiltersOpen(true)}
            >
              <Filter size={20} />
            </Button>
          </div>
        </form>

        {/* Applied Filters Display */}
        {(filters.animals.length > 0 || filters.specialties.length > 0 || filters.priceCategories.length > 0 || filters.minRating > 0) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Filtros aplicados:</p>
            <div className="flex flex-wrap gap-2">
              {filters.animals.map(animal => (
                <span key={animal} className="px-2 py-1 bg-[#79D0B8]/20 text-[#79D0B8] rounded-full text-xs">
                  {animal}
                </span>
              ))}
              {filters.specialties.map(specialty => (
                <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {specialty}
                </span>
              ))}
              {filters.priceCategories.map(price => (
                <span key={price} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  {getPriceSymbol(price)}
                </span>
              ))}
              {filters.minRating > 0 && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                  ⭐ {filters.minRating}+
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : vets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No se encontraron veterinarios</p>
            <p className="text-gray-400 text-sm">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              {vets.length} veterinario{vets.length !== 1 ? 's' : ''} encontrado{vets.length !== 1 ? 's' : ''}
            </p>
            
            {vets.map((vet) => (
              <Card
                key={vet.id}
                className="p-4 bg-white flex items-center cursor-pointer hover:shadow-md transition-shadow rounded-xl relative overflow-hidden border border-gray-200"
                onClick={() => handleVetClick(vet.id)}
              >
                <Avatar className="h-16 w-16 mr-3 shadow-sm">
                  {vet.profile_image_url ? (
                    <AvatarImage src={vet.profile_image_url} alt="Veterinario" className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-[#79D0B8] text-white">
                      {getInitials('Dr. Veterinario')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-[#1F2937] text-base">Dr. Veterinario</h3>
                  <p className="text-sm text-gray-500 font-medium">{formatSpecialization(vet.specialization)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatAnimalsTreated(vet.animals_treated)}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-medium">{vet.average_rating.toFixed(1)}</span>
                      <span className="ml-1 text-xs text-gray-500">({vet.total_reviews} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        {getPriceSymbol(vet.categoria_precio)}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {formatDistance(vet.clinic_latitude, vet.clinic_longitude)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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

export default FindVetsScreen;
