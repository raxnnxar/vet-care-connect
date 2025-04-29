
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
import ProfileImageSection from './form/ProfileImageSection';
import FormSection from './form/FormSection';
import FormFooter from './form/FormFooter';

const veterinarianSchema = z.object({
  specialization: z.string().min(1, 'La especialización es requerida'),
  license_number: z.string().min(1, 'El número de licencia es requerido'),
  years_of_experience: z.number()
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(70, 'Los años de experiencia deben ser menores a 70'),
  bio: z.string().optional(),
  profile_image_url: z.string().optional(),
  license_document_url: z.string().optional(),
  emergency_services: z.boolean(),
  availability: z.any(),
  education: z.array(z.object({
    id: z.string(),
    degree: z.string().min(1, 'El título es requerido'),
    institution: z.string().min(1, 'La institución es requerida'),
    year: z.number().min(1950, 'El año debe ser posterior a 1950').max(new Date().getFullYear(), 'El año no puede ser futuro'),
    document_url: z.string().optional(),
  })),
  certifications: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'El título es requerido'),
    organization: z.string().min(1, 'La organización es requerida'),
    issue_date: z.string().min(1, 'La fecha de emisión es requerida'),
    expiry_date: z.string().optional(),
    document_url: z.string().optional(),
  })),
  animals_treated: z.array(z.string()).min(1, 'Debe seleccionar al menos un tipo de animal'),
  services_offered: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'El nombre del servicio es requerido'),
    description: z.string().min(1, 'La descripción del servicio es requerida'),
  })),
  languages_spoken: z.array(z.string()).min(1, 'Debe seleccionar al menos un idioma'),
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
    reset,
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

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="bg-white rounded-xl shadow-lg px-6 py-8">
      <div className="space-y-12">
        {/* Profile Image Section */}
        <ProfileImageSection 
          control={control} 
          errors={errors}
          profileImageUrl={profileImageUrl}
          setProfileImageFile={setProfileImageFile}
          licenseDocumentUrl={licenseDocumentUrl}
          setLicenseDocumentFile={setLicenseDocumentFile}
          setValue={setValue}
          userId={userId}
        />

        {/* Basic Information Section */}
        <FormSection title="Información Básica">
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
            skipProfileImage={true}
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

        {/* Availability Section */}
        <FormSection title="Disponibilidad">
          <AvailabilitySection 
            control={control} 
            errors={errors} 
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

        {/* Animals Section */}
        <FormSection title="Animales">
          <AnimalsSection 
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
      />
    </form>
  );
};

export default VetProfileForm;
