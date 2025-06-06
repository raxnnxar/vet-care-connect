
import React from 'react';
import GroomingCard from './GroomingCard';
import { GroomingBusiness } from '../hooks/useGroomingData';

interface GroomingListProps {
  groomingBusinesses: GroomingBusiness[];
  onGroomingClick: (groomingId: string) => void;
}

const GroomingList: React.FC<GroomingListProps> = ({ groomingBusinesses, onGroomingClick }) => {
  return (
    <div>
      <h2 className="font-medium text-lg mb-3 text-[#1F2937]">
        Estéticas sugeridas
      </h2>
      <div className="space-y-4">
        {groomingBusinesses.map((grooming) => (
          <GroomingCard 
            key={grooming.id}
            grooming={grooming}
            onClick={onGroomingClick}
          />
        ))}
      </div>
    </div>
  );
};

export default GroomingList;
