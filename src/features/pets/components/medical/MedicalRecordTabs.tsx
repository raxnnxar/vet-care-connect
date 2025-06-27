
import React from 'react';
import MedicalRecordTabs from '@/components/medical/MedicalRecordTabs';

interface MedicalRecordTabsProps {
  petId: string;
  petOwnerId: string;
}

const PetMedicalRecordTabs: React.FC<MedicalRecordTabsProps> = ({ petId, petOwnerId }) => {
  return (
    <MedicalRecordTabs
      petId={petId}
      petOwnerId={petOwnerId}
      showHeader={true}
    />
  );
};

export default PetMedicalRecordTabs;
