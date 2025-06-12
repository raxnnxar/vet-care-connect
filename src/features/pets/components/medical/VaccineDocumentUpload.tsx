
import React from 'react';
import VaccineDocumentsList from './VaccineDocumentsList';

interface VaccineDocumentUploadProps {
  petId: string;
  petOwnerId?: string;
}

const VaccineDocumentUpload: React.FC<VaccineDocumentUploadProps> = ({ petId, petOwnerId }) => {
  // If petOwnerId is not provided, we'll get it from the pet data or assume current user
  if (!petOwnerId) {
    // This should be handled by the parent component, but as fallback we'll use empty string
    // The VaccineDocumentsList component will handle the permission checks
    console.warn('VaccineDocumentUpload: petOwnerId not provided');
  }
  
  return (
    <VaccineDocumentsList 
      petId={petId} 
      petOwnerId={petOwnerId || ''} 
    />
  );
};

export default VaccineDocumentUpload;
