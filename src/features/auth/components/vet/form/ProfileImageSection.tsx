
import React from 'react';
import BasicInfoSection from '../form-sections/BasicInfoSection';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '../../../types/veterinarianTypes';

interface ProfileImageSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  profileImageUrl: string | undefined;
  setProfileImageFile: (file: File | null) => void;
  licenseDocumentUrl: string | undefined;
  setLicenseDocumentFile: (file: File | null) => void;
  setValue: any;
  userId: string;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  control,
  errors,
  profileImageUrl,
  setProfileImageFile,
  licenseDocumentUrl,
  setLicenseDocumentFile,
  setValue,
  userId
}) => {
  return (
    <div className="flex flex-col items-center mb-8">
      <BasicInfoSection 
        control={control} 
        errors={errors}
        profileImageUrl={profileImageUrl}
        setProfileImageFile={setProfileImageFile}
        licenseDocumentUrl={licenseDocumentUrl}
        setLicenseDocumentFile={setLicenseDocumentFile}
        setValue={setValue}
        userId={userId}
        renderHeader={false}
      />
    </div>
  );
};

export default ProfileImageSection;
