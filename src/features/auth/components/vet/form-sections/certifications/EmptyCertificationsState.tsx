
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { PlusCircle } from 'lucide-react';

interface EmptyCertificationsStateProps {
  onAddClick: () => void;
}

const EmptyCertificationsState: React.FC<EmptyCertificationsStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
      <p className="text-gray-500 mb-6">
        No has añadido ninguna certificación. 
        Las certificaciones muestran tu especialización y dedicación profesional.
      </p>
      <Button 
        type="button" 
        onClick={onAddClick} 
        variant="outline"
        className="mx-auto"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Añadir Certificación
      </Button>
    </div>
  );
};

export default EmptyCertificationsState;
