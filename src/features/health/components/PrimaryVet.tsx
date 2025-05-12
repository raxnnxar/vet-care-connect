
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Skeleton } from '@/ui/atoms/skeleton';

interface VetData {
  id: string;
  name: string;
  specialization?: string;
  imageUrl: string;
}

interface PrimaryVetProps {
  vet: VetData;
  onScheduleClick: (vetId: string) => void;
  isLoading?: boolean;
}

const PrimaryVet: React.FC<PrimaryVetProps> = ({ vet, onScheduleClick, isLoading = false }) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-lg font-medium mb-3 text-[#1F2937]">
          Veterinario de cabecera
        </h2>
        <Card className="p-4 bg-white flex items-center rounded-xl shadow-md border border-gray-200">
          <Skeleton className="h-20 w-20 rounded-full mr-4" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-20" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-3 text-[#1F2937]">
        Veterinario de cabecera
      </h2>
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
          >
            Agendar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PrimaryVet;
