
import React from 'react';
import { DialogTitle, DialogDescription } from '@/ui/molecules/dialog';

interface MedicalDialogHeaderProps {
  petName: string;
}

const MedicalDialogHeader = ({ petName }: MedicalDialogHeaderProps) => {
  return (
    <>
      <DialogTitle>Información médica para {petName}</DialogTitle>
      <DialogDescription>
        Agrega información médica importante para tu mascota
      </DialogDescription>
    </>
  );
};

export default MedicalDialogHeader;
