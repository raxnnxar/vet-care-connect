
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/ui/atoms/button';
import { Alert, AlertTitle, AlertDescription } from '@/ui/molecules/alert';
import { DialogTitle, DialogDescription } from '@/ui/molecules/dialog';

interface MedicalDialogHeaderProps {
  petName: string;
  onSkipMedical: () => void;
}

const MedicalDialogHeader = ({ petName, onSkipMedical }: MedicalDialogHeaderProps) => {
  return (
    <>
      <Alert variant="success" className="mb-4">
        <Check className="h-4 w-4" />
        <AlertTitle>¡Mascota agregada con éxito!</AlertTitle>
        <AlertDescription>
          ¿Deseas agregar información médica para {petName}?
        </AlertDescription>
      </Alert>
      
      <Button 
        variant="outline" 
        onClick={onSkipMedical}
        className="w-full sm:w-auto mx-auto mb-6"
      >
        Ahora no
      </Button>
      
      <DialogTitle>Información médica para {petName}</DialogTitle>
      <DialogDescription>
        Agrega información médica importante para tu mascota
      </DialogDescription>
    </>
  );
};

export default MedicalDialogHeader;
