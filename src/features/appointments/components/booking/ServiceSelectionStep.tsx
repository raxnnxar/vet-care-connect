
import React from 'react';

interface ServiceSelectionStepProps {
  veterinarian: any;
  selectedService: any;
  onServiceSelect: (service: any) => void;
  providerType?: 'vet' | 'grooming' | null;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  veterinarian,
  selectedService,
  onServiceSelect,
  providerType
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

  const renderService = (service: any, index: number) => {
    const serviceName = service.name || service.nombre || 'Servicio';
    const servicePrice = service.price || service.precio;
    const serviceId = service.id || `service-${index}`;
    
    return (
      <div 
        key={serviceId}
        onClick={() => onServiceSelect({
          ...service,
          id: serviceId,
          name: serviceName,
          price: servicePrice
        })}
        className={`p-3 border rounded-lg cursor-pointer transition-all ${
          selectedService?.id === serviceId 
            ? 'border-[#79D0B8] bg-[#e8f7f3]' 
            : 'border-gray-200 hover:border-[#79D0B8]'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium">{serviceName}</h4>
            {service.description && (
              <p className="text-sm text-gray-600 mt-1">
                {service.description}
              </p>
            )}
            {/* Handle services with size-based pricing */}
            {service.tamaños && Array.isArray(service.tamaños) && (
              <div className="mt-2 space-y-1">
                {service.tamaños.map((tamaño: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{tamaño.tipo}</span>
                    <span className="text-green-600 font-medium">
                      {formatPrice(tamaño.precio)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {servicePrice !== undefined && !service.tamaños && (
            <div className="text-green-600 font-medium whitespace-nowrap ml-2">
              {formatPrice(servicePrice)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Selecciona un servicio</h3>
      <div className="space-y-3">
        {getServicesOffered().map((service: any, index: number) => 
          renderService(service, index)
        )}
        
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
