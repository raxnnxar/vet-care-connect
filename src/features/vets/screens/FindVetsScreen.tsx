
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
import LoadingSpinner from '@/frontend/ui/components/LoadingSpinner';
import { Json } from '@/integrations/supabase/types';

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

const FindVetsScreen = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [vets, setVets] = useState<VetSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Get user location on component mount
  useEffect(() => {
    const getLocation = async () => {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        // Load suggested vets
        loadSuggestedVets(location);
      } else {
        toast.error('No se pudo obtener la ubicación');
        // Load vets without location
        loadSuggestedVets(null);
      }
    };
    
    getLocation();
  }, []);

  const loadSuggestedVets = async (location: { latitude: number; longitude: number } | null) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('search_veterinarians', {
        p_lat: location?.latitude || null,
        p_lon: location?.longitude || null,
        p_query: null,
        p_animals: null,
        p_specialties: null,
        p_price_cat: null,
        p_rating_min: null,
        p_max_dist_m: location ? 10000 : null, // 10km radius for suggestions
        p_limit: 10,
        p_offset: 0
      });

      if (error) {
        throw error;
      }

      setVets(data || []);
    } catch (error: any) {
      console.error('Error loading suggested veterinarians:', error);
      toast.error('Error al cargar veterinarios sugeridos');
      setVets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    navigate('/owner/search-vets');
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

  const formatSpecialization = (specializations: Json) => {
    if (!specializations) {
      return "MEDICINA GENERAL";
    }
    
    let specArray: string[] = [];
    if (Array.isArray(specializations)) {
      specArray = specializations as string[];
    } else if (typeof specializations === 'string') {
      specArray = [specializations];
    }
    
    if (specArray.length === 0) {
      return "MEDICINA GENERAL";
    }
    
    const primary = specArray[0].toUpperCase();
    
    if (specArray.length > 1) {
      return `${primary} +${specArray.length - 1}`;
    }
    
    return primary;
  };

  const formatAnimalsTreated = (animals: Json) => {
    if (!animals) {
      return "Trata: Animales domésticos";
    }
    
    let animalsArray: string[] = [];
    if (Array.isArray(animals)) {
      animalsArray = animals as string[];
    } else if (typeof animals === 'string') {
      animalsArray = [animals];
    }
    
    if (animalsArray.length === 0) {
      return "Trata: Animales domésticos";
    }
    
    if (animalsArray.length <= 2) {
      return `Trata: ${animalsArray.join(', ')}`;
    }
    
    return `Trata: ${animalsArray[0]}, ${animalsArray[1]} +${animalsArray.length - 2}`;
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
        {/* Search Bar - Now Pressable */}
        <div className="mb-6" onClick={handleSearchClick}>
          <div className="relative flex gap-2 cursor-pointer">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="Buscar por nombre o especialidad"
                className="pl-10 pr-4 py-3 w-full rounded-full border border-gray-300 focus:border-[#79D0B8] focus:ring-[#79D0B8] cursor-pointer"
                value=""
                readOnly
                onClick={handleSearchClick}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="px-4 py-3 rounded-full border border-gray-300"
              onClick={handleSearchClick}
            >
              <Filter size={20} />
            </Button>
          </div>
        </div>

        {/* Suggested Vets Section */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-[#1F2937] mb-4">Veterinarios sugeridos</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : vets.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">No se encontraron veterinarios</p>
              <p className="text-gray-400 text-sm">
                Intenta buscar veterinarios específicos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
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
        </div>
      </div>
    </LayoutBase>
  );
};

export default FindVetsScreen;
