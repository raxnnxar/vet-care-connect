
import React from 'react';

interface PetPrimaryVetStatsProps {
  primaryVetCount: number;
  providerType?: 'vet' | 'grooming';
}

const PetPrimaryVetStats: React.FC<PetPrimaryVetStatsProps> = ({ 
  primaryVetCount, 
  providerType = 'vet' 
}) => {
  const providerText = providerType === 'vet' ? 'veterinario de cabecera' : 'estética de confianza';
  
  return (
    <div className="bg-[#E6F7F5] rounded-lg p-3 mb-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-[#79D0B8] mb-1">
          {primaryVetCount}
        </div>
        <div className="text-xs text-gray-600">
          {primaryVetCount === 1 
            ? `mascota con este ${providerText}` 
            : `mascotas con este ${providerText}`}
        </div>
      </div>
    </div>
  );
};

export default PetPrimaryVetStats;
