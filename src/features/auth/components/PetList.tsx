
import React from 'react';
import { Loader2 } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  profile_picture_url?: string;
}

interface PetListProps {
  pets: Pet[];
  isLoading: boolean;
}

const PetList: React.FC<PetListProps> = ({ pets, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Cargando mascotas...</span>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No tienes mascotas registradas aún
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mb-4 max-h-[300px] overflow-y-auto">
      {pets.map(pet => (
        <div key={pet.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            {pet.profile_picture_url ? (
              <div className="h-14 w-14 rounded-full overflow-hidden">
                <img 
                  src={pet.profile_picture_url} 
                  alt={pet.name} 
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {pet.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-medium">{pet.name}</p>
              <p className="text-sm text-muted-foreground">
                {pet.species} {pet.breed ? `· ${pet.breed}` : ''}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetList;
