
import React, { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Badge } from '@/ui/atoms/badge';
import { Slider } from '@/ui/atoms/slider';
import { RadioGroup, RadioGroupItem } from '@/ui/atoms/radio-group';
import { Checkbox } from '@/ui/atoms/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/molecules/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/ui/molecules/drawer';
import { useMobile } from '@/hooks/use-mobile';

interface VetFilters {
  animals: string[];
  specialties: string[];
  priceCategories: string[];
  minRating: number;
  maxDistanceKm: number;
}

interface VetFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: VetFilters;
  onApplyFilters: (filters: VetFilters) => void;
}

const AVAILABLE_ANIMALS = [
  'Perro', 'Gato', 'Conejo', 'Reptil', 'Ave', 'Roedor', 'Caballo', 'Otro'
];

const AVAILABLE_SPECIALTIES = [
  'Medicina General', 'Dermatología', 'Urgencias', 'Cirugía', 'Cardiología', 
  'Oncología', 'Oftalmología', 'Traumatología', 'Nutrición', 'Comportamiento'
];

const PRICE_CATEGORIES = [
  { value: '$', label: 'Económico ($)' },
  { value: '$$', label: 'Medio ($$)' },
  { value: '$$$', label: 'Premium ($$$)' }
];

const VetFiltersModal: React.FC<VetFiltersModalProps> = ({
  open,
  onClose,
  filters,
  onApplyFilters
}) => {
  const isMobile = useMobile();
  const [tempFilters, setTempFilters] = useState<VetFilters>(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters, open]);

  const handleAnimalToggle = (animal: string) => {
    setTempFilters(prev => ({
      ...prev,
      animals: prev.animals.includes(animal)
        ? prev.animals.filter(a => a !== animal)
        : [...prev.animals, animal]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setTempFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handlePriceCategoryToggle = (category: string) => {
    setTempFilters(prev => ({
      ...prev,
      priceCategories: prev.priceCategories.includes(category)
        ? prev.priceCategories.filter(c => c !== category)
        : [...prev.priceCategories, category]
    }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: VetFilters = {
      animals: [],
      specialties: [],
      priceCategories: [],
      minRating: 0,
      maxDistanceKm: 20
    };
    setTempFilters(clearedFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Animals Section */}
      <div>
        <h3 className="font-medium mb-3 text-[#1F2937]">Animales que trata</h3>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_ANIMALS.map((animal) => (
            <div key={animal} className="flex items-center space-x-2">
              <Checkbox
                id={`animal-${animal}`}
                checked={tempFilters.animals.includes(animal)}
                onCheckedChange={() => handleAnimalToggle(animal)}
              />
              <label
                htmlFor={`animal-${animal}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {animal}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties Section */}
      <div>
        <h3 className="font-medium mb-3 text-[#1F2937]">Especialidades</h3>
        <div className="grid grid-cols-1 gap-2">
          {AVAILABLE_SPECIALTIES.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={`specialty-${specialty}`}
                checked={tempFilters.specialties.includes(specialty)}
                onCheckedChange={() => handleSpecialtyToggle(specialty)}
              />
              <label
                htmlFor={`specialty-${specialty}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {specialty}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Category Section */}
      <div>
        <h3 className="font-medium mb-3 text-[#1F2937]">Categoría de precio</h3>
        <div className="space-y-2">
          {PRICE_CATEGORIES.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${category.value}`}
                checked={tempFilters.priceCategories.includes(category.value)}
                onCheckedChange={() => handlePriceCategoryToggle(category.value)}
              />
              <label
                htmlFor={`price-${category.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Section */}
      <div>
        <h3 className="font-medium mb-3 text-[#1F2937]">Calificación mínima</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{tempFilters.minRating} estrellas o más</span>
          </div>
          <Slider
            value={[tempFilters.minRating]}
            onValueChange={(value) => setTempFilters(prev => ({ ...prev, minRating: value[0] }))}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>
      </div>

      {/* Distance Section */}
      <div>
        <h3 className="font-medium mb-3 text-[#1F2937]">Distancia máxima</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{tempFilters.maxDistanceKm} km</span>
          </div>
          <Slider
            value={[tempFilters.maxDistanceKm]}
            onValueChange={(value) => setTempFilters(prev => ({ ...prev, maxDistanceKm: value[0] }))}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onClose}>
        <DrawerContent className="px-4 pb-4">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-left">Filtros de búsqueda</DrawerTitle>
          </DrawerHeader>
          <FilterContent />
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Limpiar
            </Button>
            <Button onClick={handleApply} className="flex-1 bg-[#79D0B8] hover:bg-[#79D0B8]/90">
              Aplicar filtros
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filtros de búsqueda</DialogTitle>
        </DialogHeader>
        <FilterContent />
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Limpiar
          </Button>
          <Button onClick={handleApply} className="flex-1 bg-[#79D0B8] hover:bg-[#79D0B8]/90">
            Aplicar filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VetFiltersModal;
