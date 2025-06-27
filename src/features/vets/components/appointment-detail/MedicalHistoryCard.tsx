
import React from 'react';

interface MedicalHistoryCardProps {
  medicalHistory: any;
  onViewFullHistory: () => void;
}

// Este componente se mantiene para compatibilidad pero ya no renderiza nada
// ya que pet_medical_history será eliminado
const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = () => {
  return null;
};

export default MedicalHistoryCard;
