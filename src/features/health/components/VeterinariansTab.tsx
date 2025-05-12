
import React, { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import VetList from './VetList';
import { Veterinarian } from '../hooks/useVeterinariansData';
import { useDebounce } from '@/hooks/use-debounce';

interface VeterinariansTabProps {
  vets: Veterinarian[];
  onVetClick: (vetId: string) => void;
}

const VeterinariansTab: React.FC<VeterinariansTabProps> = ({ vets, onVetClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredVets = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return vets;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return vets.filter(vet => {
      const nameMatch = vet.name.toLowerCase().includes(query);
      const specializationMatch = vet.specialization.some(
        spec => spec.toLowerCase().includes(query)
      );
      return nameMatch || specializationMatch;
    });
  }, [vets, debouncedSearchQuery]);

  return (
    <>
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />
      {filteredVets.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron veterinarios que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <VetList vets={filteredVets} onVetClick={onVetClick} />
      )}
    </>
  );
};

export default VeterinariansTab;
