
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/ui/atoms/button';

interface AddPetButtonProps {
  onClick: () => void;
  hasPets: boolean;
}

const AddPetButton: React.FC<AddPetButtonProps> = ({ onClick, hasPets }) => {
  return (
    <Button 
      type="button"
      variant="outline"
      className="border-dashed border-gray-300 flex flex-col h-auto py-6 px-4 items-center gap-2 w-full max-w-sm"
      onClick={onClick}
    >
      <Plus className="h-8 w-8 text-accent1" />
      <span className="text-center text-muted-foreground">
        {hasPets ? 'Agregar otra mascota' : 'Agrega tu primera mascota'}
      </span>
    </Button>
  );
};

export default AddPetButton;
