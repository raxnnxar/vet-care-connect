
import React from 'react';
import { usePrimaryVet } from '@/features/health/hooks/usePrimaryVet';
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
  const {
    pets,
    selectedPets,
    loading,
    saving,
    feedbackPet,
    loadPets,
    handleTogglePet,
    primaryVetCount
  } = usePrimaryVet(vetId, vetName);

  return (
    <PetPrimaryProviderDialog
      open={open}
      onClose={onClose}
      providerName={vetName}
      providerType="vet"
      pets={pets}
      selectedPets={selectedPets}
      loading={loading}
      saving={saving}
      feedbackPet={feedbackPet}
      primaryCount={primaryVetCount}
      onLoadPets={loadPets}
      onTogglePet={handleTogglePet}
    />
  );
};

export default PetPrimaryVetDialog;
