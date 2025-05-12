
import React, { useState } from 'react';
import { Stethoscope, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/ui/molecules/card';
import { Button } from '@/ui/atoms/button';

interface ServiceOffered {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

interface VetServicesSectionProps {
  services: ServiceOffered[];
}

const VetServicesSection: React.FC<VetServicesSectionProps> = ({ services }) => {
  const [showAll, setShowAll] = useState(false);
  
  // Format price
  const formatPrice = (price?: number) => {
    if (price === undefined) return '';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (services.length === 0) {
    return null;
  }

  // Show only top 3 services unless "Ver todos" is clicked
  const displayServices = showAll ? services : services.slice(0, 3);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Stethoscope className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Servicios Principales
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {displayServices.map((service) => (
          <div key={service.id} className="py-3 border-b last:border-0">
            <div className="flex justify-between">
              <div className="flex-1">
                <span className="font-medium">{service.name}</span>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
              </div>
              {service.price !== undefined && (
                <div className="text-green-600 font-medium">
                  {formatPrice(service.price)}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      {services.length > 3 && (
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
                Ver todos los servicios ({services.length})
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default VetServicesSection;
