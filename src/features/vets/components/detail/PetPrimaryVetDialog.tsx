
import React from 'react';
import PetPrimaryProviderDialog from '@/features/shared/components/PetPrimaryProviderDialog';

interface PetPrimaryVetDialogProps {
  open: boolean;
  onClose: () => void;
  vetId: string;
  vetName: string;
}

const PetPrimaryVetDialog: React.FC<PetPrimaryVetDialogProps> = ({ 
  open, 
  onClose, 
  vetId,
  vetName
}) => {
  return (
    <PetPrimaryProviderDialog
      open={open}
      onClose={onClose}
      providerId={vetId}
      providerName={vetName}
      providerType="vet"
    />
  );
};

export default PetPrimaryVetDialog;
