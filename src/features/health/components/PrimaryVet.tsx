
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
        <Card className="p-4 bg-white flex items-center rounded-xl shadow-md border border-gray-200">
          <div className="relative">
            <Avatar className="h-20 w-20 mr-4 border-2 border-[#79D0B8] shadow-lg">
              <AvatarImage src={vet.imageUrl} alt={vet.name} className="object-cover" />
              <AvatarFallback className="bg-[#79D0B8] text-white">
                {vet.name.split(' ').map(name => name[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1F2937] text-lg">{vet.name}</h3>
            {vet.specialization && (
              <p className="text-sm text-gray-600">{vet.specialization}</p>
            )}
            <Button 
              onClick={() => onScheduleClick(vet.id)}
              className="mt-3 bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-md transition-all duration-200 rounded-lg font-medium"
              size="sm"
              disabled={loading}
            >
              Agendar
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#79D0B8]/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4DA6A8]">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" x2="19" y1="8" y2="14"></line>
                <line x1="16" x2="22" y1="11" y2="11"></line>
              </svg>
            </div>
            <h3 className="font-semibold text-[#1F2937] text-lg mb-2">Sin veterinario de cabecera</h3>
            <p className="text-gray-600 mb-4">Selecciona un veterinario de confianza para tu mascota</p>
            <Button 
              onClick={onFindVetsClick}
              className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-md transition-all duration-200 rounded-lg font-medium w-full"
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
