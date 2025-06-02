
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneNumberField from './PhoneNumberField';
import ProfileImageUploader from './ProfileImageUploader';

const profileSchema = z.object({
  phoneNumber: z.string().min(1, 'El número de teléfono es requerido'),
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
      />
      
      <p className="text-white text-sm">
        Esta información previene el abandono de mascotas y nos ayuda a contactar a los dueños en caso de ser necesario.
      </p>
    </div>
  );
};

export default ProfileSetupForm;
