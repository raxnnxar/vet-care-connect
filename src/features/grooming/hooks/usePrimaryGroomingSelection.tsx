
import { useState } from 'react';
import { usePrimaryGroomingData } from './usePrimaryGroomingData';

export const usePrimaryGroomingSelection = (selectedPetId?: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { primaryGrooming } = usePrimaryGroomingData(selectedPetId);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isPrimaryGrooming = (groomingId: string) => {
    return primaryGrooming?.id === groomingId;
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    isPrimaryGrooming,
    primaryGrooming
  };
};
