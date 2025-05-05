
import React from 'react';
import VetCard from './VetCard';

interface Vet {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  distance: string;
}

interface VetListProps {
  vets: Vet[];
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
