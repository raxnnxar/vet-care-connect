
import React from 'react';
import { Separator } from '@/ui/atoms/separator';
import { Pet } from '@/features/pets/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConfirmationStepProps {
  selectedPet: Pet | null;
  selectedService: any;
  selectedServiceSize?: any;
  selectedDate: Date | null;
  selectedTime: string | null;
  veterinarian: any;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedPet,
  selectedService,
  selectedServiceSize,
  selectedDate,
  selectedTime,
  veterinarian
}) => {
  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getVetName = () => {
    if (!veterinarian) return '';
    
    const displayName = veterinarian.service_providers?.profiles?.display_name 
      || veterinarian.service_providers?.business_name 
      || veterinarian.business_name // For grooming providers
      || '';
      
    const firstNameEndsWithA = displayName.split(' ')[0].toLowerCase().endsWith('a');
    return displayName ? `Dr${firstNameEndsWithA ? 'a' : ''}. ${displayName}` : '';
  };

  const getServiceDisplayInfo = () => {
    if (!selectedService) return { name: '', price: undefined };
    
    if (selectedServiceSize) {
      return {
        name: `${selectedService.nombre || selectedService.name} (${selectedServiceSize.tipo})`,
        price: selectedServiceSize.precio
      };
    }
    
    return {
      name: selectedService.nombre || selectedService.name,
      price: selectedService.precio || selectedService.price
    };
  };

  const serviceInfo = getServiceDisplayInfo();

  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Confirma tu cita</h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-sm text-gray-500">Mascota</span>
          {selectedPet && (
            <div className="font-medium">{selectedPet.name}</div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <span className="text-sm text-gray-500">Servicio</span>
          <div className="font-medium">{serviceInfo.name}</div>
          {serviceInfo.price !== undefined && (
            <div className="text-green-600">{formatPrice(serviceInfo.price)}</div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <span className="text-sm text-gray-500">Fecha y hora</span>
          {selectedDate && (
            <div className="font-medium">
              {format(selectedDate, 'EEEE, d MMMM', { locale: es })} - {selectedTime}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <span className="text-sm text-gray-500">Proveedor</span>
          <div className="font-medium">{getVetName()}</div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationStep;
