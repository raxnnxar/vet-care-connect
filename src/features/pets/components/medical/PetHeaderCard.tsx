
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Pet } from '@/features/pets/types';
import { usePetAllergies } from '@/features/pets/hooks/usePetAllergies';
import { usePetChronicConditions } from '@/features/pets/hooks/usePetChronicConditions';

interface PetHeaderCardProps {
  pet: Pet;
}

const PetHeaderCard: React.FC<PetHeaderCardProps> = ({ pet }) => {
  const { allergies } = usePetAllergies(pet.id);
  const { conditions } = usePetChronicConditions(pet.id);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mx-4 mt-4 mb-0 p-4 bg-white border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Avatar más grande */}
        <div className="w-16 h-16 bg-[#79D0B8] rounded-full flex items-center justify-center flex-shrink-0">
          {pet.profile_picture_url ? (
            <img 
              src={pet.profile_picture_url} 
              alt={pet.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {getInitials(pet.name)}
            </span>
          )}
        </div>

        {/* Información de la mascota */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-800 truncate">{pet.name}</h2>
          <p className="text-gray-600 text-sm mt-1">
            {pet.species} • {pet.breed || 'Raza no especificada'}
          </p>
          
          {/* Edad y peso en una línea si están disponibles */}
          {(pet.date_of_birth || pet.weight) && (
            <p className="text-gray-500 text-xs mt-1">
              {pet.date_of_birth && (
                <>
                  {(() => {
                    const birthDate = new Date(pet.date_of_birth);
                    const today = new Date();
                    const ageInMs = today.getTime() - birthDate.getTime();
                    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365));
                    return ageInYears > 0 ? `${ageInYears} años` : 'Menos de 1 año';
                  })()}
                </>
              )}
              {pet.date_of_birth && pet.weight && ' • '}
              {pet.weight && `${pet.weight} kg`}
            </p>
          )}
        </div>
      </div>

      {/* Alergias y condiciones en tags compactos */}
      {(allergies.length > 0 || conditions.length > 0) && (
        <div className="mt-4 space-y-2">
          {allergies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Alergias:</p>
              <div className="flex flex-wrap gap-1">
                {allergies.map((allergy) => (
                  <Badge 
                    key={allergy.id} 
                    variant="outline" 
                    className="text-xs px-2 py-1 h-auto text-red-600 border-red-200 bg-red-50"
                  >
                    {allergy.allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {conditions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Condiciones crónicas:</p>
              <div className="flex flex-wrap gap-1">
                {conditions.map((condition) => (
                  <Badge 
                    key={condition.id} 
                    variant="outline" 
                    className="text-xs px-2 py-1 h-auto text-orange-600 border-orange-200 bg-orange-50"
                  >
                    {condition.condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default PetHeaderCard;
