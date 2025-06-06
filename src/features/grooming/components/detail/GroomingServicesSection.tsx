
import React, { useState } from 'react';
import { Scissors, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';

interface ServiceOffered {
  id?: string;
  name?: string;
  nombre?: string;
  description?: string;
  price?: number;
  precio?: number;
  tamaños?: Array<{
    tipo: 'pequeño' | 'mediano' | 'grande';
    precio: number;
  }>;
}

interface GroomingServicesSectionProps {
  services: ServiceOffered[];
}

const GroomingServicesSection: React.FC<GroomingServicesSectionProps> = ({ services }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Format price
  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  // Ensure services is an array before proceeding
  const servicesList = Array.isArray(services) ? services : [];

  if (servicesList.length === 0) {
    return null;
  }

  // Show only top 3 services unless "Ver todos" is clicked
  const displayServices = showAll ? servicesList : servicesList.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Scissors className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Servicios Principales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {displayServices.map((service, index) => {
          const serviceName = service.name || service.nombre || 'Servicio';
          const servicePrice = service.price || service.precio;
          
          return (
            <div key={service.id || index} className="py-3 border-b last:border-0">
              <div className="flex justify-between">
                <div className="flex-1">
                  <span className="font-medium">{serviceName}</span>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                  {service.tamaños && service.tamaños.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {service.tamaños.map((tamaño, idx) => (
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
                  <div className="text-green-600 font-medium">
                    {formatPrice(servicePrice)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
      {servicesList.length > 3 && (
        <CardFooter className="flex justify-center pt-0 pb-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowAll(!showAll)}
            className="text-[#4DA6A8] hover:text-[#3C9B9D] hover:bg-[#e8f7f3]"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Ver todos los servicios ({servicesList.length})
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default GroomingServicesSection;
