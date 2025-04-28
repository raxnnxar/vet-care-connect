
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { PlusCircle } from 'lucide-react';

interface AddPetButtonProps {
  hasPets: boolean;
  onClick: () => void;
}

const AddPetButton: React.FC<AddPetButtonProps> = ({ hasPets, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 py-3 ${
        hasPets
          ? 'border-dashed border-white/60 text-white bg-transparent hover:bg-white/10 transition-colors'
          : 'bg-white/90 text-[#79D0B8] hover:bg-white transition-colors'
      }`}
    >
      <PlusCircle size={18} />
      <span>{hasPets ? 'Agregar otra mascota' : 'Agregar mascota'}</span>
    </Button>
  );
};

export default AddPetButton;
