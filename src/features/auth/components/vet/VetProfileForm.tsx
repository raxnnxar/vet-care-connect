
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/molecules/tabs';
import { 
  Info, 
  GraduationCap, 
  Award, 
  Calendar, 
  Stethoscope, 
  PawPrint,
  Save
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState("basic-info");
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
    <form onSubmit={handleSubmit(processSubmit)} className="bg-white rounded-xl shadow-lg overflow-hidden">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="bg-gray-50 p-4 border-b">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="basic-info" className="flex flex-col items-center gap-1 py-2">
              <Info className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Información Básica</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex flex-col items-center gap-1 py-2">
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Educación</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex flex-col items-center gap-1 py-2">
              <Award className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Certificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex flex-col items-center gap-1 py-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Disponibilidad</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex flex-col items-center gap-1 py-2">
              <Stethoscope className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Servicios</span>
            </TabsTrigger>
            <TabsTrigger value="animals" className="flex flex-col items-center gap-1 py-2">
              <PawPrint className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Animales</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="basic-info">
            <BasicInfoSection 
              control={control} 
              errors={errors}
              profileImageUrl={profileImageUrl}
              setProfileImageFile={setProfileImageFile}
              licenseDocumentUrl={licenseDocumentUrl}
              setLicenseDocumentFile={setLicenseDocumentFile}
              setValue={setValue}
              userId={userId}
            />
          </TabsContent>
          
          <TabsContent value="education">
            <EducationSection 
              control={control} 
              errors={errors}
              setValue={setValue}
              userId={userId}
            />
          </TabsContent>
          
          <TabsContent value="certifications">
            <CertificationsSection 
              control={control} 
              errors={errors} 
              setValue={setValue}
              userId={userId}
            />
          </TabsContent>
          
          <TabsContent value="availability">
            <AvailabilitySection 
              control={control} 
              errors={errors} 
            />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesSection 
              control={control} 
              errors={errors} 
              setValue={setValue} 
            />
          </TabsContent>
          
          <TabsContent value="animals">
            <AnimalsSection 
              control={control} 
              errors={errors}
            />
          </TabsContent>
        </div>
      </Tabs>

      <div className="bg-gray-50 p-6 border-t flex justify-between items-center">
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
    </form>
  );
};

export default VetProfileForm;
