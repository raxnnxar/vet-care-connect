
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneNumberField from './PhoneNumberField';
import ProfileAddressField from './ProfileAddressField';
import ProfileImageUploader from './ProfileImageUploader';
import FinishSetupButton from './FinishSetupButton';

const profileSchema = z.object({
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileSetupFormProps {
  initialValues: ProfileFormValues;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isLoading: boolean;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  setProfileImageFile: (file: File | null) => void;
  isUploadingImage: boolean;
  displayName?: string;
}

const ProfileSetupForm: React.FC<ProfileSetupFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  profileImage,
  setProfileImage,
  setProfileImageFile,
  isUploadingImage,
  displayName,
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const isFormValid = form.watch('phoneNumber').length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }
    await onSubmit(form.getValues());
  };

  return (
    <div className="space-y-6">
      <ProfileImageUploader
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        setProfileImageFile={setProfileImageFile}
        isUploading={isUploadingImage}
        displayName={displayName}
      />
      
      <PhoneNumberField
        value={form.watch('phoneNumber')}
        onChange={(value) => form.setValue('phoneNumber', value)}
        label="Número de teléfono"
        placeholder="Ingresa tu número de teléfono"
        helpText="Esto lo pedimos para prevenir el abandono de mascotas y poder contactar con los dueños en caso de ser necesario."
      />
      
      <ProfileAddressField
        value={form.watch('address')}
        onChange={(value) => form.setValue('address', value)}
        label="Dirección"
        placeholder="Ingresa tu dirección"
        helpText="Esto lo pedimos para prevenir el abandono de mascotas y poder contactar con los dueños en caso de ser necesario."
      />

      <div className="mt-8">
        <FinishSetupButton
          onClick={handleSubmit}
          disabled={!isFormValid || isLoading}
        />
      </div>
    </div>
  );
};

export default ProfileSetupForm;
