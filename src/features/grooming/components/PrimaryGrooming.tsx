
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Button } from '@/ui/atoms/button';
import { Scissors } from 'lucide-react';

interface GroomingData {
  id: string;
  business_name: string;
  services?: string[];
  profile_image_url: string;
}

interface PrimaryGroomingProps {
  grooming: GroomingData | null;
  onScheduleClick: (groomingId: string) => void;
  onFindGroomingClick?: () => void;
  loading?: boolean;
}

const PrimaryGrooming: React.FC<PrimaryGroomingProps> = ({ 
  grooming, 
  onScheduleClick, 
  onFindGroomingClick, 
  loading = false 
}) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-3 text-[#1F2937]">
        Estética de confianza
      </h2>
      
      {grooming ? (
        <Card className="p-3 bg-white flex items-center rounded-xl shadow-sm border border-gray-200">
          <div className="relative">
            <Avatar className="h-12 w-12 mr-3 border border-[#79D0B8]">
              <AvatarImage src={grooming.profile_image_url} alt={grooming.business_name} className="object-cover" />
              <AvatarFallback className="bg-[#79D0B8] text-white">
                <Scissors className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1F2937] text-base">{grooming.business_name}</h3>
            {grooming.services && grooming.services.length > 0 && (
              <p className="text-xs text-gray-600">
                {grooming.services.slice(0, 2).join(', ')}
                {grooming.services.length > 2 && ` +${grooming.services.length - 2}`}
              </p>
            )}
            <Button 
              onClick={() => onScheduleClick(grooming.id)}
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
            <h3 className="font-semibold text-[#1F2937] text-base mb-1">Sin estética de confianza</h3>
            <p className="text-xs text-gray-600 mb-2">Aún no tienes una estética de confianza seleccionada</p>
            <Button 
              onClick={onFindGroomingClick}
              className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white shadow-sm text-xs px-3 py-1 h-7 rounded-md font-medium w-full"
              disabled={loading}
            >
              Buscar estéticas
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PrimaryGrooming;
