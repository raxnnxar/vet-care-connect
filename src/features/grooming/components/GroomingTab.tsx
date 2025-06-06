
import React, { useState, useMemo } from 'react';
import SearchBar from '@/features/health/components/SearchBar';
import GroomingList from './GroomingList';
import { GroomingBusiness } from '../hooks/useGroomingData';
import { useDebounce } from '@/hooks/use-debounce';

interface GroomingTabProps {
  groomingBusinesses: GroomingBusiness[];
  onGroomingClick: (groomingId: string) => void;
}

const GroomingTab: React.FC<GroomingTabProps> = ({ groomingBusinesses, onGroomingClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredGrooming = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return groomingBusinesses;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return groomingBusinesses.filter(grooming => {
      const nameMatch = grooming.business_name.toLowerCase().includes(query);
      const servicesMatch = grooming.services_offered?.some(service => {
        const serviceName = typeof service === 'string' ? service : (service?.name || '');
        return serviceName.toLowerCase().includes(query);
      });
      const animalsMatch = grooming.animals_accepted?.some(animal => 
        animal.toLowerCase().includes(query)
      );
      return nameMatch || servicesMatch || animalsMatch;
    });
  }, [groomingBusinesses, debouncedSearchQuery]);

  return (
    <>
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />
      {filteredGrooming.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No se encontraron estéticas que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <GroomingList groomingBusinesses={filteredGrooming} onGroomingClick={onGroomingClick} />
      )}
    </>
  );
};

export default GroomingTab;
