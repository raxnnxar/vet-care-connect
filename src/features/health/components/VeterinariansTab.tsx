
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import VetList from './VetList';

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
}

const VeterinariansTab: React.FC<VeterinariansTabProps> = ({ vets, onVetClick }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Here we could filter vets based on searchQuery if needed
  const filteredVets = vets;

  return (
    <>
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={handleSearchChange} 
      />
      <VetList vets={filteredVets} onVetClick={onVetClick} />
    </>
  );
};

export default VeterinariansTab;
