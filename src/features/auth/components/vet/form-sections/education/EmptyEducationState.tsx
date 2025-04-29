
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface EmptyEducationStateProps {
  onAddClick: () => void;
}

const EmptyEducationState: React.FC<EmptyEducationStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center p-6 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
      <p className="text-gray-500 mb-4">
        No has añadido ninguna formación académica. 
        Añade tu educación para generar confianza en los dueños de mascotas.
      </p>
      <Button 
        type="button" 
        onClick={onAddClick} 
        variant="outline"
        className="mx-auto"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Añadir Formación
      </Button>
    </div>
  );
};

export default EmptyEducationState;
