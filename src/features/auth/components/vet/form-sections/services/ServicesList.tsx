
import React from 'react';
import { ServiceOffered } from '@/features/auth/types/veterinarianTypes';
import { Button } from '@/ui/atoms/button';
import { PlusCircle, Stethoscope, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/molecules/card';

interface ServicesListProps {
  services: ServiceOffered[];
  onAddClick: () => void;
  onRemoveService: (index: number) => void;
}

const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onAddClick,
  onRemoveService
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <Card key={service.id}>
            <CardHeader className="bg-gray-50 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-gray-500" />
                  {service.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 text-sm">{service.description}</p>
            </CardContent>
            <CardFooter className="flex justify-end border-t bg-gray-50 py-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onRemoveService(index)}
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          type="button" 
          onClick={onAddClick} 
          variant="outline"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Servicio
        </Button>
      </div>
    </>
  );
};

export default ServicesList;
