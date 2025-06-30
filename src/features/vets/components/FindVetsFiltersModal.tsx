
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Badge } from '@/ui/atoms/badge';
import { Slider } from '@/ui/atoms/slider';
import { Star } from 'lucide-react';

interface SearchFilters {
  animals: string[];
  specialties: string[];
  priceCategories: string[];
  minRating: number;
  maxDistance: number;
}

interface FindVetsFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (filters: SearchFilters) => void;
}

const ANIMALS_OPTIONS = [
  'Perros', 'Gatos', 'Aves', 'Conejos', 'Hámsters', 'Reptiles', 'Peces'
];

const SPECIALTIES_OPTIONS = [
  'Medicina General', 'Cirugía', 'Dermatología', 'Cardiología', 
  'Oftalmología', 'Traumatología', 'Medicina Interna', 'Urgencias'
];

const PRICE_CATEGORIES = [
  { id: 'economico', label: 'Económico ($)', symbol: '$' },
  { id: 'moderado', label: 'Moderado ($$)', symbol: '$$' },
  { id: 'premium', label: 'Premium ($$$)', symbol: '$$$' }
];

const FindVetsFiltersModal: React.FC<FindVetsFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply
}) => {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const handleAnimalToggle = (animal: string) => {
    setLocalFilters(prev => ({
      ...prev,
      animals: toggleArrayItem(prev.animals, animal)
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setLocalFilters(prev => ({
      ...prev,
      specialties: toggleArrayItem(prev.specialties, specialty)
    }));
  };

  const handlePriceCategoryToggle = (category: string) => {
    setLocalFilters(prev => ({
      ...prev,
      priceCategories: toggleArrayItem(prev.priceCategories, category)
    }));
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: rating
    }));
  };

  const handleDistanceChange = (distance: number[]) => {
    setLocalFilters(prev => ({
      ...prev,
      maxDistance: distance[0]
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      animals: [],
      specialties: [],
      priceCategories: [],
      minRating: 0,
      maxDistance: 20
    };
    setLocalFilters(resetFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtros de búsqueda</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Animals Filter */}
          <div>
            <h3 className="font-medium mb-3">Animales que trata</h3>
            <div className="flex flex-wrap gap-2">
              {ANIMALS_OPTIONS.map(animal => (
                <Badge
                  key={animal}
                  variant={localFilters.animals.includes(animal) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    localFilters.animals.includes(animal) 
                      ? 'bg-[#79D0B8] hover:bg-[#5FBFB3]' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleAnimalToggle(animal)}
                >
                  {animal}
                </Badge>
              ))}
            </div>
          </div>

          {/* Specialties Filter */}
          <div>
            <h3 className="font-medium mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES_OPTIONS.map(specialty => (
                <Badge
                  key={specialty}
                  variant={localFilters.specialties.includes(specialty) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    localFilters.specialties.includes(specialty) 
                      ? 'bg-[#79D0B8] hover:bg-[#5FBFB3]' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSpecialtyToggle(specialty)}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Price Categories Filter */}
          <div>
            <h3 className="font-medium mb-3">Rango de precios</h3>
            <div className="flex flex-wrap gap-2">
              {PRICE_CATEGORIES.map(price => (
                <Badge
                  key={price.id}
                  variant={localFilters.priceCategories.includes(price.id) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    localFilters.priceCategories.includes(price.id) 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handlePriceCategoryToggle(price.id)}
                >
                  {price.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Minimum Rating Filter */}
          <div>
            <h3 className="font-medium mb-3">Calificación mínima</h3>
            <div className="flex items-center gap-4 mb-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating === localFilters.minRating ? 0 : rating)}
                  className={`flex items-center gap-1 px-2 py-1 rounded ${
                    localFilters.minRating >= rating 
                      ? 'text-yellow-600' 
                      : 'text-gray-400'
                  }`}
                >
                  <Star 
                    size={20} 
                    className={localFilters.minRating >= rating ? 'fill-yellow-500' : ''} 
                  />
                  <span className="text-sm">{rating}</span>
                </button>
              ))}
            </div>
            {localFilters.minRating > 0 && (
              <p className="text-sm text-gray-600">
                Mostrar veterinarios con {localFilters.minRating}+ estrellas
              </p>
            )}
          </div>

          {/* Distance Filter */}
          <div>
            <h3 className="font-medium mb-3">
              Distancia máxima: {localFilters.maxDistance} km
            </h3>
            <Slider
              value={[localFilters.maxDistance]}
              onValueChange={handleDistanceChange}
              max={50}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Limpiar filtros
          </Button>
          <Button onClick={handleApply} className="bg-[#79D0B8] hover:bg-[#5FBFB3]">
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FindVetsFiltersModal;
