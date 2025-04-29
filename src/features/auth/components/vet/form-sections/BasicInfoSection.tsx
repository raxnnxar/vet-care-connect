
import React, { useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { VeterinarianProfile, SPECIALIZATIONS, LANGUAGES } from '../../../types/veterinarianTypes';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/ui/atoms/avatar';
import { Camera, Check, Upload, Loader2, X } from 'lucide-react';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Textarea } from '@/ui/atoms/textarea';
import { Switch } from '@/ui/atoms/switch';
import { Button } from '@/ui/atoms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/molecules/select';
import { toast } from 'sonner';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/ui/molecules/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';
import { Badge } from '@/ui/atoms/badge';
import { cn } from '@/lib/utils';

interface BasicInfoSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  profileImageUrl?: string;
  setProfileImageFile: (file: File | null) => void;
  licenseDocumentUrl?: string;
  setLicenseDocumentFile: (file: File | null) => void;
  setValue: any;
  userId: string;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  control,
  errors,
  profileImageUrl,
  setProfileImageFile,
  licenseDocumentUrl,
  setLicenseDocumentFile,
  setValue,
  userId
}) => {
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [isUploadingLicenseDoc, setIsUploadingLicenseDoc] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageSearchValue, setLanguageSearchValue] = useState('');

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setProfileImageFile(file);
    setIsUploadingProfileImage(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vet-documents')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('vet-documents')
        .getPublicUrl(filePath);
        
      setValue('profile_image_url', urlData.publicUrl);
      toast.success('Imagen de perfil subida con éxito');
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast.error(`Error al subir la imagen: ${error.message}`);
    } finally {
      setIsUploadingProfileImage(false);
    }
  };
  
  const handleLicenseDocUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setLicenseDocumentFile(file);
    setIsUploadingLicenseDoc(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/license-${Date.now()}.${fileExt}`;
      const filePath = `licenses/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vet-documents')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('vet-documents')
        .getPublicUrl(filePath);
        
      setValue('license_document_url', urlData.publicUrl);
      toast.success('Documento de licencia subido con éxito');
    } catch (error: any) {
      console.error('Error uploading license document:', error);
      toast.error(`Error al subir el documento: ${error.message}`);
    } finally {
      setIsUploadingLicenseDoc(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-2xl font-semibold mb-6">Información Básica</h2>
        
        {/* Profile Image Upload */}
        <div className="mb-8">
          <div className="relative mx-auto">
            <Avatar className="w-32 h-32 border-2 border-gray-200">
              {profileImageUrl ? (
                <AvatarImage src={profileImageUrl} alt="Foto de perfil" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-gray-100">
                  <Camera className="h-8 w-8 text-gray-400" />
                </AvatarFallback>
              )}
            </Avatar>
            
            <label 
              htmlFor="profile-image-upload" 
              className="absolute bottom-0 right-0 bg-white text-[#79D0B8] hover:text-[#5FBFB3] rounded-full p-2 shadow cursor-pointer transition-colors"
            >
              {isUploadingProfileImage ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </label>
            
            <input 
              type="file" 
              id="profile-image-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleProfileImageUpload}
              disabled={isUploadingProfileImage}
            />
          </div>
          <p className="text-sm text-center text-gray-500 mt-2">
            Sube una foto profesional para tu perfil
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specialization */}
        <div className="space-y-2">
          <Label htmlFor="specialization">
            Especialización <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="specialization"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <SelectTrigger className={cn(
                  "w-full", 
                  errors.specialization && "border-red-500"
                )}>
                  <SelectValue placeholder="Selecciona tu especialización" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIALIZATIONS.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.specialization && (
            <p className="text-sm text-red-500">{errors.specialization.message}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <Label htmlFor="years_of_experience">
            Años de Experiencia <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="years_of_experience"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="years_of_experience"
                type="number"
                min="0"
                max="70"
                value={field.value}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className={errors.years_of_experience ? "border-red-500" : ""}
              />
            )}
          />
          {errors.years_of_experience && (
            <p className="text-sm text-red-500">{errors.years_of_experience.message}</p>
          )}
        </div>

        {/* License Number */}
        <div className="space-y-2">
          <Label htmlFor="license_number">
            Número de Licencia <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="license_number"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="license_number"
                placeholder="Ej. CRMV-SP 12345"
                className={errors.license_number ? "border-red-500" : ""}
              />
            )}
          />
          {errors.license_number && (
            <p className="text-sm text-red-500">{errors.license_number.message}</p>
          )}
        </div>

        {/* License Document Upload */}
        <div className="space-y-2">
          <Label htmlFor="license_document">Documento de Licencia</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 flex items-center justify-center gap-2"
              onClick={() => document.getElementById('license-document-upload')?.click()}
              disabled={isUploadingLicenseDoc}
            >
              {isUploadingLicenseDoc ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : licenseDocumentUrl ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Documento Subido
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Subir Documento
                </>
              )}
            </Button>
            
            <input
              type="file"
              id="license-document-upload"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleLicenseDocUpload}
              disabled={isUploadingLicenseDoc}
            />
            
            {licenseDocumentUrl && (
              <a
                href={licenseDocumentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm underline"
              >
                Ver
              </a>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Sube una copia de tu licencia o cédula profesional (.pdf, .jpg, .png)
          </p>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Biografía Profesional</Label>
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="bio"
              placeholder="Escribe una breve descripción de tu formación, experiencia y enfoque profesional..."
              className="min-h-[120px] resize-y"
            />
          )}
        />
      </div>

      {/* Languages Spoken */}
      <div className="space-y-2">
        <Label>
          Idiomas <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="languages_spoken"
          control={control}
          render={({ field }) => (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value?.length && "text-muted-foreground",
                      errors.languages_spoken && "border-red-500"
                    )}
                  >
                    <span>
                      {field.value?.length
                        ? `${field.value.length} idioma${field.value.length > 1 ? 's' : ''} seleccionado${field.value.length > 1 ? 's' : ''}`
                        : "Selecciona idiomas"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput 
                      placeholder="Buscar idioma..." 
                      value={languageSearchValue}
                      onValueChange={setLanguageSearchValue}
                    />
                    <CommandEmpty>No se encontró ningún idioma.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {LANGUAGES.map((language) => {
                        const isSelected = field.value?.includes(language.value);
                        return (
                          <CommandItem
                            key={language.value}
                            onSelect={() => {
                              let newValues: string[];
                              
                              if (isSelected) {
                                newValues = field.value?.filter(
                                  (val: string) => val !== language.value
                                ) || [];
                              } else {
                                newValues = [...(field.value || []), language.value];
                              }
                              
                              field.onChange(newValues);
                              setSelectedLanguages(newValues);
                              setLanguageSearchValue('');
                            }}
                          >
                            <div 
                              className={cn(
                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                              )}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </div>
                            <span>{language.label}</span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((lang: string) => {
                  const language = LANGUAGES.find(l => l.value === lang);
                  return (
                    <Badge key={lang} variant="secondary" className="py-1">
                      {language?.label || lang}
                      <button
                        type="button"
                        onClick={() => {
                          const newValues = field.value.filter((val: string) => val !== lang);
                          field.onChange(newValues);
                          setSelectedLanguages(newValues);
                        }}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </>
          )}
        />
        {errors.languages_spoken && (
          <p className="text-sm text-red-500">{errors.languages_spoken.message}</p>
        )}
      </div>

      {/* Emergency Services */}
      <div className="flex items-center justify-between mt-4 py-2">
        <div className="space-y-0.5">
          <Label htmlFor="emergency_services" className="text-base">
            Servicios de Emergencia
          </Label>
          <p className="text-sm text-gray-500">
            ¿Ofreces atención de emergencias fuera del horario habitual?
          </p>
        </div>
        <Controller
          name="emergency_services"
          control={control}
          render={({ field }) => (
            <Switch
              id="emergency_services"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
