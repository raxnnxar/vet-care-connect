
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
import { Button } from '@/ui/atoms/button';
import { Save } from 'lucide-react';

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

  const renderSectionHeader = (title: string) => (
    <div className="border-b border-gray-200 pb-2 mb-6">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="bg-white rounded-xl shadow-lg px-6 py-8">
      <div className="space-y-12">
        {/* Profile Image Section */}
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

        {/* Basic Information Section */}
        <div className="space-y-6">
          {renderSectionHeader("Información Básica")}
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
        </div>

        {/* Education Section */}
        <div className="space-y-6">
          {renderSectionHeader("Educación")}
          <EducationSection 
            control={control} 
            errors={errors}
            setValue={setValue}
            userId={userId}
          />
        </div>

        {/* Certifications Section */}
        <div className="space-y-6">
          {renderSectionHeader("Certificaciones")}
          <CertificationsSection 
            control={control} 
            errors={errors} 
            setValue={setValue}
            userId={userId}
          />
        </div>

        {/* Availability Section */}
        <div className="space-y-6">
          {renderSectionHeader("Disponibilidad")}
          <AvailabilitySection 
            control={control} 
            errors={errors} 
          />
        </div>

        {/* Services Section */}
        <div className="space-y-6">
          {renderSectionHeader("Servicios")}
          <ServicesSection 
            control={control} 
            errors={errors} 
            setValue={setValue} 
          />
        </div>

        {/* Animals Section */}
        <div className="space-y-6">
          {renderSectionHeader("Animales")}
          <AnimalsSection 
            control={control} 
            errors={errors}
          />
        </div>
      </div>

      {/* Form Footer with Submit Button */}
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm">
                Hay campos con errores. Por favor revisa todas las secciones.
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !isValid} 
            className="bg-[#79D0B8] hover:bg-[#5FBFB3]"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Perfil
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VetProfileForm;
