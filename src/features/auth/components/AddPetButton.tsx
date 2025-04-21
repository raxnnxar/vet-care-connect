
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { PlusCircle } from 'lucide-react';

export interface AddPetButtonProps {
  onClick: () => void;
  hasPets: boolean;
}

const AddPetButton = ({ onClick, hasPets }: AddPetButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border-dashed border-2 border-gray-300 py-6"
    >
      <PlusCircle size={20} />
      <span>{hasPets ? 'Agregar otra mascota' : 'Agregar mascota'}</span>
    </Button>
  );
};

export default AddPetButton;
