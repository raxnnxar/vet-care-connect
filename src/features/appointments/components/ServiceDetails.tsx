
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { MapPin, Notes } from 'lucide-react';

interface ServiceDetailsProps {
  serviceType?: string;
  duration?: number;
  price?: number;
  clinicName?: string;
  clinicAddress?: string;
  notes?: string;
  paymentStatus?: string;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  serviceType,
  duration,
  price,
  clinicName,
  clinicAddress,
  notes,
  paymentStatus
}) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Detalles del Servicio</h3>
        <div className="space-y-3">
          {serviceType && (
            <div>
              <p className="text-sm text-gray-500">Tipo de Servicio</p>
              <p className="font-medium">{serviceType}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            {duration && (
              <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="font-medium">{duration} minutos</p>
              </div>
            )}
            
            {price && (
              <div>
                <p className="text-sm text-gray-500">Precio</p>
                <p className="font-medium">${price}</p>
              </div>
            )}
          </div>
          
          {paymentStatus && (
            <div>
              <p className="text-sm text-gray-500">Estado del Pago</p>
              <p className="font-medium capitalize">{paymentStatus}</p>
            </div>
          )}
        </div>
      </Card>

      {(clinicName || clinicAddress) && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Ubicación</h3>
          <div className="space-y-2">
            {clinicName && <p className="font-medium">{clinicName}</p>}
            {clinicAddress && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="h-5 w-5 text-[#79D0B8] mt-0.5" />
                <p>{clinicAddress}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {notes && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Notes className="h-5 w-5 text-[#79D0B8]" />
            <h3 className="font-semibold">Notas</h3>
          </div>
          <p className="text-gray-600">{notes}</p>
        </Card>
      )}
    </div>
  );
};
