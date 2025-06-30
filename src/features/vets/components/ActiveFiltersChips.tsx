
import React from 'react';
import { X, Star, MapPin } from 'lucide-react';
import { Badge } from '@/ui/atoms/badge';

interface VetFilters {
  animals: string[];
  specialties: string[];
  priceCategories: string[];
  minRating: number;
  maxDistanceKm: number;
}

interface ActiveFiltersChipsProps {
  filters: VetFilters;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

const ActiveFiltersChips: React.FC<ActiveFiltersChipsProps> = ({
  filters,
  onRemoveFilter,
  onClearAll
}) => {
  const hasActiveFilters = 
    filters.animals.length > 0 ||
    filters.specialties.length > 0 ||
    filters.priceCategories.length > 0 ||
    filters.minRating > 0 ||
    filters.maxDistanceKm < 20;

  if (!hasActiveFilters) return null;

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
        <button
          onClick={onClearAll}
          className="text-xs text-[#79D0B8] font-medium hover:text-[#79D0B8]/80"
        >
          Limpiar todo
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* Animal filters */}
        {filters.animals.map((animal) => (
          <Badge
            key={`animal-${animal}`}
            variant="secondary"
            className="bg-[#79D0B8]/10 text-[#79D0B8] border-[#79D0B8]/20 hover:bg-[#79D0B8]/20"
          >
            {animal}
            <button
              onClick={() => onRemoveFilter('animals', animal)}
              className="ml-1 hover:text-[#79D0B8]/70"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Specialty filters */}
        {filters.specialties.map((specialty) => (
          <Badge
            key={`specialty-${specialty}`}
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            {specialty}
            <button
              onClick={() => onRemoveFilter('specialties', specialty)}
              className="ml-1 hover:text-blue-600"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Price category filters */}
        {filters.priceCategories.map((category) => (
          <Badge
            key={`price-${category}`}
            variant="secondary"
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            {category}
            <button
              onClick={() => onRemoveFilter('priceCategories', category)}
              className="ml-1 hover:text-green-600"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Rating filter */}
        {filters.minRating > 0 && (
          <Badge
            variant="secondary"
            className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
          >
            <Star className="h-3 w-3 mr-1" />
            {filters.minRating}+ estrellas
            <button
              onClick={() => onRemoveFilter('minRating')}
              className="ml-1 hover:text-yellow-600"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {/* Distance filter */}
        {filters.maxDistanceKm < 20 && (
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Hasta {filters.maxDistanceKm} km
            <button
              onClick={() => onRemoveFilter('maxDistanceKm')}
              className="ml-1 hover:text-purple-600"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ActiveFiltersChips;
