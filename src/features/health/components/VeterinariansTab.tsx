
import React from 'react';
import SearchBar from './SearchBar';
import VetList from './VetList';
import { Skeleton } from '@/ui/atoms/skeleton';

interface Vet {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
}

interface VeterinariansTabProps {
  vets: Vet[];
  onVetClick: (vetId: string) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const VeterinariansTab: React.FC<VeterinariansTabProps> = ({ 
  vets, 
  onVetClick, 
  searchQuery, 
  onSearchChange,
  isLoading = false 
}) => {
  return (
    <>
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={onSearchChange} 
      />
      
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center">
                <Skeleton className="h-16 w-16 rounded-lg" />
                <div className="ml-4 space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : vets.length > 0 ? (
        <VetList vets={vets} onVetClick={onVetClick} />
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 text-center">No se encontraron veterinarios con esos criterios</p>
        </div>
      )}
    </>
  );
};

export default VeterinariansTab;
