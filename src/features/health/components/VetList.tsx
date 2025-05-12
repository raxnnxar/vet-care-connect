
import React from 'react';
import VetCard from './VetCard';
import { Veterinarian } from '../hooks/useVeterinariansData';

interface VetListProps {
  vets: Veterinarian[];
  onVetClick: (vetId: string) => void;
}

const VetList: React.FC<VetListProps> = ({ vets, onVetClick }) => {
  return (
    <div>
      <h2 className="font-medium text-lg mb-3 text-[#1F2937]">
        Veterinarios sugeridos
      </h2>
      <div className="space-y-4">
        {vets.map((vet) => (
          <VetCard 
            key={vet.id}
            vet={vet}
            onClick={onVetClick}
          />
        ))}
      </div>
    </div>
  );
};

export default VetList;
