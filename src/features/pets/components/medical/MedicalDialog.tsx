
import React from 'react';
import { Pet } from '../../types';
import MedicalForm from './MedicalForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/ui/molecules/dialog';

interface MedicalDialogProps {
  pet: Pet;
  onClose: () => void;
  open: boolean;
}

const MedicalDialog: React.FC<MedicalDialogProps> = ({ pet, onClose, open }) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Información médica para {pet.name}</DialogTitle>
          <DialogDescription>
            Agrega información médica importante para tu mascota
          </DialogDescription>
        </DialogHeader>

        <MedicalForm 
          pet={pet} 
          onClose={onClose} 
          onSuccess={handleSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default MedicalDialog;
