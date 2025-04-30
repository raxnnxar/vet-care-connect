import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { VeterinarianProfile } from '../../types/veterinarianTypes';
import BasicInfoSection from './form-sections/BasicInfoSection';
import EducationSection from './form-sections/EducationSection';
import CertificationsSection from './form-sections/CertificationsSection';
import AvailabilitySection from './form-sections/AvailabilitySection';
import ServicesSection from './form-sections/ServicesSection';
import AnimalsSection from './form-sections/AnimalsSection';
import LanguagesSection from './form-sections/LanguagesSection';
import ProfileImageSection from './form/ProfileImageSection';
import FormSection from './form/FormSection';
import FormFooter from './form/FormFooter';
import EmergencyServicesSection from './form-sections/EmergencyServicesSection';

// Updated schema to make all fields optional
const veterinarianSchema = z.object({
  // All top-level fields made optional with defaults
  specializations: z.array(z.string()).optional().default([]),
  license_number: z.string().optional().default(''),
  years_of_experience: z.number()
    .optional()
    .default(0),
  bio: z.string().optional().default(''),
  profile_image_url: z.string().optional(),
  license_document_url: z.string().optional(),
  emergency_services: z.boolean().optional().default(false),
  availability: z.any().optional().default({}),
  
  // Nested arrays with optional fields
  education: z.array(z.object({
    id: z.string(),
    degree: z.string().optional().default(''),
    institution: z.string().optional().default(''),
    year: z.number().optional().default(new Date().getFullYear()),
    document_url: z.string().optional(),
  })).optional().default([]),
  
  certifications: z.array(z.object({
    id: z.string(),
    title: z.string().optional().default(''),
    organization: z.string().optional().default(''),
    issue_date: z.string().optional().default(''),
    expiry_date: z.string().optional(),
    document_url: z.string().optional(),
  })).optional().default([]),
  
  animals_treated: z.array(z.string()).optional().default([]),
  
  services_offered: z.array(z.object({
    id: z.string(),
    name: z.string().optional().default(''),
    description: z.string().optional().default(''),
  })).optional().default([]),
  
  languages_spoken: z.array(z.string()).optional().default([]),
});

interface VetProfileFormProps {
  initialData: VeterinarianProfile;
  onSubmit: (data: VeterinarianProfile) => Promise<void>;
  isSubmitting: boolean;
  userId: string;
}

const VetProfileForm: React.FC<VetProfileFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  userId
}) => {
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [licenseDocumentFile, setLicenseDocumentFile] = useState<File | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    getValues
  } = useForm<VeterinarianProfile>({
    resolver: zodResolver(veterinarianSchema),
    defaultValues: initialData,
    mode: 'onChange',
  });

  const profileImageUrl = watch('profile_image_url');
  const licenseDocumentUrl = watch('license_document_url');
  
  const processSubmit = async (data: VeterinarianProfile) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const forceSubmit = () => {
    // Get current values regardless of validation
    const currentData = getValues();
    onSubmit(currentData);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="px-4">
      <div className="space-y-8">
        {/* Profile Image Section */}
        <ProfileImageSection 
          control={control} 
          errors={errors}
          profileImageUrl={profileImageUrl}
          setProfileImageFile={setProfileImageFile}
          userId={userId}
          setValue={setValue}
        />

        {/* Basic Information Section */}
        <FormSection title="Información Básica">
          <BasicInfoSection 
            control={control} 
            errors={errors}
            licenseDocumentUrl={licenseDocumentUrl}
            setLicenseDocumentFile={setLicenseDocumentFile}
            setValue={setValue}
            userId={userId}
          />
        </FormSection>

        {/* Education Section */}
        <FormSection title="Educación">
          <EducationSection 
            control={control} 
            errors={errors}
            setValue={setValue}
            userId={userId}
          />
        </FormSection>

        {/* Certifications Section */}
        <FormSection title="Certificaciones">
          <CertificationsSection 
            control={control} 
            errors={errors} 
            setValue={setValue}
            userId={userId}
          />
        </FormSection>

        {/* Services Section */}
        <FormSection title="Servicios">
          <ServicesSection 
            control={control} 
            errors={errors} 
            setValue={setValue} 
          />
        </FormSection>

        {/* Languages Section */}
        <FormSection title="Idiomas">
          <LanguagesSection 
            control={control} 
            errors={errors}
          />
        </FormSection>

        {/* Animals Section */}
        <FormSection title="Animales que Tratas">
          <AnimalsSection 
            control={control} 
            errors={errors}
          />
        </FormSection>

        {/* Availability Section */}
        <FormSection title="Disponibilidad">
          <AvailabilitySection 
            control={control} 
            errors={errors} 
          />
        </FormSection>

        {/* Emergency Services Section */}
        <FormSection title="Servicios de Emergencia">
          <EmergencyServicesSection 
            control={control} 
            errors={errors}
          />
        </FormSection>
      </div>

      {/* Form Footer with Submit Button */}
      <FormFooter 
        isSubmitting={isSubmitting} 
        isValid={isValid} 
        hasErrors={Object.keys(errors).length > 0} 
        onForceSubmit={forceSubmit}
      />
    </form>
  );
};

export default VetProfileForm;
