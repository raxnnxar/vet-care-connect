
import React from 'react';
import { SheetHeader, SheetTitle } from '@/ui/molecules/sheet';

interface PetPrimaryVetDialogHeaderProps {
  vetName: string;
}

const PetPrimaryVetDialogHeader: React.FC<PetPrimaryVetDialogHeaderProps> = ({ vetName }) => {
  return (
    <SheetHeader className="pb-4 border-b border-gray-100">
      <SheetTitle className="text-center text-xl font-semibold text-gray-800">
        <span className="block">{vetName}</span>
        <span className="block text-sm text-gray-500 font-normal mt-1">
          Selecciona las mascotas para este proveedor
        </span>
      </SheetTitle>
    </SheetHeader>
  );
};

export default PetPrimaryVetDialogHeader;
