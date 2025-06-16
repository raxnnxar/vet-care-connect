
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Cat } from 'lucide-react';

interface PetInfoCardProps {
  pet: any;
}

const PetInfoCard: React.FC<PetInfoCardProps> = ({ pet }) => {
  const calculateAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const ageInMs = today.getTime() - birthDate.getTime();
      const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365));
      return ageInYears > 0 ? `${ageInYears} años` : 'Menos de 1 año';
    } catch {
      return 'Edad no disponible';
    }
  };

  if (!pet) return null;

  return (
    <Card className="p-4">
      <h2 className="text-xl font-medium text-[#1F2937] mb-4 flex items-center">
        <Cat className="mr-2 text-[#79D0B8]" size={20} />
        Información de la Mascota
      </h2>
      
      <div className="flex items-center mb-4">
        <div className="bg-gray-100 p-3 rounded-full mr-4">
          <Cat size={32} className="text-[#4DA6A8]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{pet.name}</h3>
          <p className="text-gray-500">{pet.species}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        {pet.breed && (
          <div>
            <p className="text-gray-500">Raza</p>
            <p className="font-medium">{pet.breed}</p>
          </div>
        )}
        {pet.date_of_birth && (
          <div>
            <p className="text-gray-500">Edad</p>
            <p className="font-medium">{calculateAge(pet.date_of_birth)}</p>
          </div>
        )}
        {pet.weight && (
          <div>
            <p className="text-gray-500">Peso</p>
            <p className="font-medium">{pet.weight} kg</p>
          </div>
        )}
        {pet.sex && (
          <div>
            <p className="text-gray-500">Sexo</p>
            <p className="font-medium">{pet.sex === 'male' ? 'Macho' : 'Hembra'}</p>
          </div>
        )}
        {pet.temperament && (
          <div className="col-span-2">
            <p className="text-gray-500">Temperamento</p>
            <p className="font-medium">{pet.temperament}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PetInfoCard;
