
import React from 'react';
import { SheetHeader, SheetTitle } from '@/ui/molecules/sheet';

interface PetPrimaryVetDialogHeaderProps {
  vetName: string;
  title?: string;
}

const PetPrimaryVetDialogHeader: React.FC<PetPrimaryVetDialogHeaderProps> = ({ 
  vetName, 
  title = "Veterinario de cabecera" 
}) => {
  return (
    <SheetHeader className="mb-6">
      <SheetTitle className="text-xl font-bold text-gray-800 mb-2">
        {title}
      </SheetTitle>
      <p className="text-gray-600 text-sm">
        Selecciona las mascotas para {vetName}
      </p>
    </SheetHeader>
  );
};

export default PetPrimaryVetDialogHeader;
