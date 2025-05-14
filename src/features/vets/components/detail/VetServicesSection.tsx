
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

interface VetServicesSectionProps {
  services: Service[];
}

const VetServicesSection: React.FC<VetServicesSectionProps> = ({ services }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Ensure services is an array
  const servicesList = Array.isArray(services) ? services : [];
  
  // Display up to 3 services when collapsed, or all when expanded
  const displayedServices = isExpanded 
    ? servicesList 
    : servicesList.slice(0, 3);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  if (!servicesList.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Servicios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No hay servicios disponibles</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {displayedServices.map((service) => (
            <li key={service.id} className="border-b last:border-0 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                </div>
                {service.price !== undefined && (
                  <div className="text-right font-medium">
                    ${service.price.toFixed(2)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        {servicesList.length > 3 && (
          <button 
            onClick={toggleExpand}
            className="flex items-center text-[#79D0B8] mt-3 text-sm"
          >
            {isExpanded ? (
              <>Ver menos <ChevronUp className="ml-1 w-4 h-4" /></>
            ) : (
              <>Ver todos ({servicesList.length}) <ChevronDown className="ml-1 w-4 h-4" /></>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default VetServicesSection;
