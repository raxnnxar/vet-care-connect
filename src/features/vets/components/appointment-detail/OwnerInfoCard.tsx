
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Phone, MapPin } from 'lucide-react';

interface OwnerInfoCardProps {
  ownerInfo: any;
}

const OwnerInfoCard: React.FC<OwnerInfoCardProps> = ({ ownerInfo }) => {
  if (!ownerInfo) return null;

  return (
    <Card className="p-4">
      <h2 className="text-xl font-medium text-[#1F2937] mb-4 flex items-center">
        <Phone className="mr-2 text-[#79D0B8]" size={20} />
        Información del Dueño
      </h2>
      
      <div className="space-y-3">
        {ownerInfo.phone_number && (
          <div className="flex items-center">
            <Phone className="text-[#79D0B8] mr-3" size={16} />
            <div>
              <p className="text-sm text-gray-500">Teléfono</p>
              <p className="font-medium">{ownerInfo.phone_number}</p>
            </div>
          </div>
        )}
        
        {ownerInfo.address && (
          <div className="flex items-start">
            <MapPin className="text-[#79D0B8] mr-3 mt-0.5" size={16} />
            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="font-medium">{ownerInfo.address}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OwnerInfoCard;
