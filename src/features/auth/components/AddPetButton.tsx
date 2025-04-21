
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { Plus } from 'lucide-react';

export interface AddPetButtonProps {
  onClick: () => void;
  hasPets?: boolean;
}

const AddPetButton = ({ onClick, hasPets = false }: AddPetButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 h-12 border-dashed border-gray-300 hover:border-teal-500 hover:text-teal-600 transition-colors"
    >
      <Plus className="w-5 h-5" />
      <span>{hasPets ? "Agregar otra mascota" : "Agregar una mascota"}</span>
    </Button>
  );
};

export default AddPetButton;
