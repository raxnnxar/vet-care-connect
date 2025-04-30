
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { PlusCircle } from 'lucide-react';

interface EmptyServicesStateProps {
  onAddClick: () => void;
}

const EmptyServicesState: React.FC<EmptyServicesStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
      <p className="text-gray-500 mb-6">
        No has añadido ningún servicio. 
        Detalla los servicios que ofreces para que los dueños de mascotas sepan qué esperar.
      </p>
      <Button 
        type="button" 
        onClick={onAddClick} 
        variant="outline"
        className="mx-auto"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Añadir Servicio
      </Button>
    </div>
  );
};

export default EmptyServicesState;
