
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '../../../types/veterinarianTypes';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/molecules/alert-dialog';
import { useCertificationForm } from './certifications/useCertificationForm';
import CertificationsList from './certifications/CertificationsList';
import EmptyCertificationsState from './certifications/EmptyCertificationsState';
import CertificationForm from './certifications/CertificationForm';

interface CertificationsSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  setValue: any;
  userId: string;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  control,
  errors,
  setValue,
  userId
}) => {
  const {
    certificationFields,
    isDialogOpen,
    isUploading,
    newCertification,
    newCertificationFile,
    newCertificationErrors,
    openDialog,
    closeDialog,
    handleFieldChange,
    handleDateSelect,
    clearExpiryDate,
    handleFileSelect,
    handleAddCertification,
    handleUploadDocument,
    removeCertification,
    setIsDialogOpen
  } = useCertificationForm({ control, setValue, userId });

  return (
    <div className="space-y-6">
      {/* Use Array.isArray to check if certificationFields exists and is an array */}
      {Array.isArray(certificationFields) && certificationFields.length === 0 ? (
        <EmptyCertificationsState onAddClick={openDialog} />
      ) : (
        <CertificationsList 
          certifications={certificationFields || []}
          isUploading={isUploading}
          onAddClick={openDialog}
          onRemoveCertification={removeCertification}
          onUploadDocument={handleUploadDocument}
        />
      )}

      {/* Add Certification Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Añadir Certificación</AlertDialogTitle>
            <AlertDialogDescription>
              Añade detalles sobre tus certificaciones profesionales para mostrar tu especialización.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <CertificationForm
            title={newCertification.title}
            organization={newCertification.organization}
            issueDate={newCertification.issue_date}
            expiryDate={newCertification.expiry_date || ''}
            errors={newCertificationErrors}
            certificationFile={newCertificationFile}
            onFieldChange={handleFieldChange}
            onDateSelect={handleDateSelect}
            onClearExpiryDate={clearExpiryDate}
            onFileSelect={handleFileSelect}
            onCancel={closeDialog}
            onSubmit={handleAddCertification}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CertificationsSection;
