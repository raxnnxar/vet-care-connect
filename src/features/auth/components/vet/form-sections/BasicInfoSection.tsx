
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Switch } from '@/ui/atoms/switch';
import { useController } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/molecules/select';
import { AlertCircle, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';

interface BasicInfoSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  profileImageUrl: string | undefined;
  setProfileImageFile: (file: File | null) => void;
  licenseDocumentUrl: string | undefined;
  setLicenseDocumentFile: (file: File | null) => void;
  setValue: any;
  userId: string;
  renderHeader?: boolean;
  skipProfileImage?: boolean;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  errors,
  profileImageUrl,
  setProfileImageFile,
  licenseDocumentUrl,
  setLicenseDocumentFile,
  setValue,
  userId,
  renderHeader = true,
  skipProfileImage = false,
}) => {
  const { field: specializationField } = useController({
    name: 'specialization',
    control,
  });

  const { field: emergencyServicesField } = useController({
    name: 'emergency_services',
    control,
  });

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 5) {
      toast.error('La imagen no debe exceder 5MB');
      return;
    }
    
    setProfileImageFile(file);
    
    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('vet-profile-images')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('vet-profile-images')
        .getPublicUrl(filePath);

      setValue('profile_image_url', data.publicUrl);
      toast.success('Imagen de perfil actualizada');
    } catch (error: any) {
      toast.error('Error al subir la imagen: ' + error.message);
      console.error('Error uploading profile image:', error);
    }
  };

  const handleLicenseDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 10) {
      toast.error('El documento no debe exceder 10MB');
      return;
    }
    
    setLicenseDocumentFile(file);
    
    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('vet-license-documents')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('vet-license-documents')
        .getPublicUrl(filePath);

      setValue('license_document_url', data.publicUrl);
      toast.success('Documento de licencia actualizado');
    } catch (error: any) {
      toast.error('Error al subir el documento: ' + error.message);
      console.error('Error uploading license document:', error);
    }
  };

  return (
    <>
      {renderHeader && (
        <div className="mb-6">
          <h3 className="text-lg font-medium">Información Básica</h3>
          <p className="text-gray-500 text-sm">
            Información personal y credenciales profesionales
          </p>
        </div>
      )}

      {/* Profile Image Upload */}
      {!skipProfileImage && (
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-[#79D0B8]/30">
              {profileImageUrl ? (
                <AvatarImage src={profileImageUrl} alt="Foto de perfil" />
              ) : (
                <AvatarFallback className="bg-[#79D0B8]/20 text-[#79D0B8] flex items-center justify-center">
                  <Upload className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
            />
            <label
              htmlFor="profile-image"
              className="absolute bottom-0 right-0 rounded-full bg-[#79D0B8] p-2 cursor-pointer shadow-md hover:bg-[#5FBFB3] transition-colors"
            >
              <Upload className="h-4 w-4 text-white" />
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Añade tu foto profesional
          </p>
        </div>
      )}
      
      {/* Specialization */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="specialization">
          Especialización <span className="text-red-500">*</span>
        </Label>
        <Select 
          onValueChange={specializationField.onChange}
          defaultValue={specializationField.value}
        >
          <SelectTrigger id="specialization" className={errors.specialization ? 'border-red-500' : ''}>
            <SelectValue placeholder="Selecciona una especialización" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Medicina general</SelectItem>
            <SelectItem value="cardiology">Cardiología</SelectItem>
            <SelectItem value="dermatology">Dermatología</SelectItem>
            <SelectItem value="surgery">Cirugía</SelectItem>
            <SelectItem value="orthopedics">Ortopedia</SelectItem>
            <SelectItem value="ophthalmology">Oftalmología</SelectItem>
            <SelectItem value="neurology">Neurología</SelectItem>
            <SelectItem value="dentistry">Odontología</SelectItem>
          </SelectContent>
        </Select>
        {errors.specialization && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.specialization.message}
          </p>
        )}
      </div>
        
      {/* License Number */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="license_number">
          Número de licencia <span className="text-red-500">*</span>
        </Label>
        <Input
          id="license_number"
          {...control.register('license_number')}
          className={errors.license_number ? 'border-red-500' : ''}
        />
        {errors.license_number && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.license_number.message}
          </p>
        )}
      </div>
        
      {/* License Document Upload */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="license_document">Documento de licencia</Label>
        <div className="flex items-center gap-2">
          <Input
            id="license_document"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleLicenseDocumentChange}
          />
          <div className={`flex-1 border rounded-md h-10 px-3 py-2 text-sm ${licenseDocumentUrl ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            {licenseDocumentUrl ? 'Documento subido' : 'Ningún documento seleccionado'}
          </div>
          <label
            htmlFor="license_document"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#79D0B8] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5FBFB3] cursor-pointer"
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir
          </label>
        </div>
        {licenseDocumentUrl && (
          <div className="text-xs text-green-600 flex items-center mt-1">
            <a href={licenseDocumentUrl} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
              Ver documento
            </a>
          </div>
        )}
      </div>
        
      {/* Years of Experience */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="years_of_experience">
          Años de experiencia <span className="text-red-500">*</span>
        </Label>
        <Input
          id="years_of_experience"
          type="number"
          min="0"
          max="70"
          {...control.register('years_of_experience', {
            valueAsNumber: true,
          })}
          className={errors.years_of_experience ? 'border-red-500' : ''}
        />
        {errors.years_of_experience && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.years_of_experience.message}
          </p>
        )}
      </div>
        
      {/* Bio */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="bio">Biografía profesional</Label>
        <Textarea
          id="bio"
          {...control.register('bio')}
          rows={4}
          placeholder="Describe tu experiencia profesional, enfoque de práctica, o cualquier información adicional relevante"
        />
      </div>
        
      {/* Emergency Services */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Label htmlFor="emergency_services" className="mb-1 block">Servicios de emergencia</Label>
          <p className="text-gray-500 text-xs">¿Ofreces atención de emergencia fuera del horario habitual?</p>
        </div>
        <Switch 
          id="emergency_services"
          checked={emergencyServicesField.value}
          onCheckedChange={emergencyServicesField.onChange}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
