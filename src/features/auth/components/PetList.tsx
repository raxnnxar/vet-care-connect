
import React from 'react';
import { Pet } from '@/features/pets/types';

interface PetListProps {
  pets: Pet[];
  isLoading: boolean;
}

const PetList: React.FC<PetListProps> = ({ pets, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white/30 backdrop-blur-sm border border-white/30 p-4 rounded-lg animate-pulse flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-white/30"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-white/30 rounded"></div>
              <div className="h-3 w-16 bg-white/30 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!pets.length) {
    return (
      <div className="text-center py-6 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
        <p className="text-white text-sm">No tienes mascotas registradas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="bg-white/90 p-4 rounded-lg shadow-sm flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary font-semibold">
            {pet.name ? pet.name.substring(0, 2).toUpperCase() : 'P'}
          </div>
          <div>
            <h4 className="font-medium text-gray-800">{pet.name}</h4>
            <p className="text-sm text-gray-500">
              {pet.species}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetList;
