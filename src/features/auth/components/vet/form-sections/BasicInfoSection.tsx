
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import SpecializationsSelector from './basic-info/SpecializationsSelector';
import LicenseDocumentUpload from './basic-info/LicenseDocumentUpload';
import BasicInfoFields from './basic-info/BasicInfoFields';

interface BasicInfoSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  licenseDocumentUrl: string | undefined;
  setLicenseDocumentFile: (file: File | null) => void;
  setValue: any;
  userId: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  errors,
  licenseDocumentUrl,
  setLicenseDocumentFile,
  setValue,
  userId,
}) => {
  return (
    <div className="space-y-6">
      {/* Specializations - Multi-select */}
      <SpecializationsSelector 
        control={control}
        errors={errors}
      />
        
      {/* License Document Upload */}
      <LicenseDocumentUpload
        licenseDocumentUrl={licenseDocumentUrl}
        setLicenseDocumentFile={setLicenseDocumentFile}
        setValue={setValue}
        userId={userId}
      />
      
      {/* Basic Fields - License Number, Years of Experience, Bio */}
      <BasicInfoFields
        control={control}
        errors={errors}
      />
    </div>
  );
};

export default BasicInfoSection;
