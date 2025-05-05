
import React from 'react';
import {
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/molecules/alert-dialog';
import CertificationBasicInfo from './form/CertificationBasicInfo';
import CertificationDateFields from './form/CertificationDateFields';
import CertificationDocumentUpload from './form/CertificationDocumentUpload';

interface CertificationFormProps {
  title: string;
  organization: string;
  issueDate: string;
  expiryDate: string;
  errors: Record<string, string>;
  certificationFile: File | null;
  onFieldChange: (field: string, value: string) => void;
  onDateSelect: (field: string, date: Date | undefined) => void;
  onClearExpiryDate: () => void;
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  title,
  organization,
  issueDate,
  expiryDate,
  errors,
  certificationFile,
  onFieldChange,
  onDateSelect,
  onClearExpiryDate,
  onFileSelect,
  onCancel,
  onSubmit
}) => {
  return (
    <>
      <div className="space-y-4 py-2">
        <CertificationBasicInfo 
          title={title}
          organization={organization}
          errors={errors}
          onFieldChange={onFieldChange}
        />

        <CertificationDateFields 
          issueDate={issueDate}
          expiryDate={expiryDate}
          errors={errors}
          onDateSelect={onDateSelect}
          onClearExpiryDate={onClearExpiryDate}
        />

        <CertificationDocumentUpload 
          certificationFile={certificationFile}
          onFileSelect={onFileSelect}
        />
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          Añadir
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default CertificationForm;
