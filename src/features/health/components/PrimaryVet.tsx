
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';

interface VetData {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
}

interface PrimaryVetProps {
  vet: VetData | null;
  onScheduleClick: (vetId: string) => void;
  onFindVetsClick?: () => void;
  loading?: boolean;
}

const PrimaryVet: React.FC<PrimaryVetProps> = ({ vet, onScheduleClick, onFindVetsClick, loading = false }) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-3 text-[#1F2937]">
        Veterinario de cabecera
      </h2>
      
      {vet && vet.id !== 'select-primary-vet' ? (
        <Card className="p-3 bg-white flex items-center rounded-xl shadow-sm border border-gray-200">
          <div className="relative">
            <Avatar className="h-12 w-12 mr-3 border border-[#79D0B8]">
              <AvatarImage src={vet.imageUrl} alt={vet.name} className="object-cover" />
              <AvatarFallback className="bg-[#79D0B8] text-white">
                {vet.name.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1F2937] text-base">{vet.name}</h3>
            {vet.specialization && (
              <p className="text-xs text-gray-600">{vet.specialization}</p>
            )}
            <Button 
              onClick={() => onScheduleClick(vet.id)}
              className="mt-2 bg-[#79D0B8] hover:bg-[#4DA6A8] text-white text-xs px-3 py-1 h-7 rounded-md font-medium"
              disabled={loading}
            >
              Agendar
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col items-start text-left">
            <h3 className="font-semibold text-[#1F2937] text-base mb-1">Sin veterinario de cabecera</h3>
            <p className="text-xs text-gray-600 mb-2">Selecciona un veterinario de confianza para tu mascota</p>
            <Button 
              onClick={onFindVetsClick}
              className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-sm text-xs px-3 py-1 h-7 rounded-md font-medium w-full"
              disabled={loading}
            >
              Buscar veterinarios
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrimaryVet;
