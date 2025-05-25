
import React from 'react';

interface ServiceSelectionStepProps {
  veterinarian: any;
  selectedService: any;
  onServiceSelect: (service: any) => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  veterinarian,
  selectedService,
  onServiceSelect
}) => {
  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getServicesOffered = () => {
    if (!veterinarian?.services_offered) return [];
    if (Array.isArray(veterinarian.services_offered)) return veterinarian.services_offered;
    return [];
  };

  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Selecciona un servicio</h3>
      <div className="space-y-3">
        {getServicesOffered().map((service: any) => (
          <div 
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className={`p-3 border rounded-lg cursor-pointer transition-all ${
              selectedService?.id === service.id 
                ? 'border-[#79D0B8] bg-[#e8f7f3]' 
                : 'border-gray-200 hover:border-[#79D0B8]'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{service.name}</h4>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {service.description}
                  </p>
                )}
              </div>
              {service.price !== undefined && (
                <div className="text-green-600 font-medium whitespace-nowrap ml-2">
                  {formatPrice(service.price)}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {getServicesOffered().length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay servicios disponibles
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceSelectionStep;
