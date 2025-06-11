
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

  const capitalizeFirst = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const getServicesOffered = () => {
    if (!veterinarian?.services_offered) return [];
    if (Array.isArray(veterinarian.services_offered)) return veterinarian.services_offered;
    return [];
  };

  const expandServicesWithSizes = () => {
    const services = getServicesOffered();
    const expandedServices: any[] = [];

    services.forEach((service: any, serviceIndex: number) => {
      const serviceName = service.name || service.nombre || 'Servicio';
      const servicePrice = service.price || service.precio;
      const baseServiceId = service.id || `service-${serviceIndex}`;

      // If service has sizes, create individual options for each size
      if (service.tamaños && Array.isArray(service.tamaños)) {
        service.tamaños.forEach((tamaño: any, sizeIndex: number) => {
          expandedServices.push({
            ...service,
            id: `${baseServiceId}-${tamaño.tipo}`,
            name: serviceName,
            displayName: `${serviceName} (${capitalizeFirst(tamaño.tipo)})`,
            price: tamaño.precio,
            sizeType: tamaño.tipo,
            originalService: service,
            isExpandedSize: true
          });
        });
      } else {
        // Regular service without sizes
        expandedServices.push({
          ...service,
          id: baseServiceId,
          name: serviceName,
          displayName: serviceName,
          price: servicePrice,
          isExpandedSize: false
        });
      }
    });

    return expandedServices;
  };

  const renderService = (service: any) => {
    const serviceName = service.displayName || service.name;
    const servicePrice = service.price;
    const serviceId = service.id;
    
    return (
      <div 
        key={serviceId}
        onClick={() => onServiceSelect(service)}
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
          </div>
          {servicePrice !== undefined && (
            <div className="text-green-600 font-medium whitespace-nowrap ml-2">
              {formatPrice(servicePrice)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const expandedServices = expandServicesWithSizes();

  return (
    <>
      <h3 className="font-medium text-gray-700 mb-4">Selecciona un servicio</h3>
      <div className="space-y-3">
        {expandedServices.map((service: any) => 
          renderService(service)
        )}
        
        {expandedServices.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay servicios disponibles
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceSelectionStep;
