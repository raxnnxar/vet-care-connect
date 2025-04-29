
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { useController } from 'react-hook-form';
import { AlertCircle, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile, SPECIALIZATIONS } from '@/features/auth/types/veterinarianTypes';
import { Badge } from '@/ui/atoms/badge';
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
import { Button } from '@/ui/atoms/button';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

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
  const [specializationSearchValue, setSpecializationSearchValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const { field: specializationsField } = useController({
    name: 'specializations',
    control,
  });

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
    <div className="space-y-6">
      {/* Specializations - Multi-select */}
      <div className="space-y-2">
        <Label htmlFor="specializations" className="text-base">
          Especializaciones <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-500">
          Selecciona todas las especializaciones que apliquen a tu práctica veterinaria
        </p>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "w-full justify-start text-left font-normal",
                !specializationsField.value?.length && "text-muted-foreground",
                errors.specializations ? "border-red-500" : ""
              )}
            >
              <span>
                {specializationsField.value?.length
                  ? `${specializationsField.value.length} especialización${specializationsField.value.length > 1 ? 'es' : ''} seleccionada${specializationsField.value.length > 1 ? 's' : ''}`
                  : "Selecciona especializaciones"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Buscar especialización..." 
                value={specializationSearchValue}
                onValueChange={setSpecializationSearchValue}
              />
              <CommandEmpty>No se encontró ninguna coincidencia.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {Array.isArray(SPECIALIZATIONS) && SPECIALIZATIONS.map((spec) => {
                  const isSelected = Array.isArray(specializationsField.value) && 
                    specializationsField.value.includes(spec.value);
                  return (
                    <CommandItem
                      key={spec.value}
                      onSelect={() => {
                        let newValues: string[] = [];
                        
                        if (isSelected) {
                          newValues = Array.isArray(specializationsField.value) ? 
                            specializationsField.value.filter(
                              (val: string) => val !== spec.value
                            ) : [];
                        } else {
                          newValues = [...(Array.isArray(specializationsField.value) ? specializationsField.value : []), spec.value];
                        }
                        
                        specializationsField.onChange(newValues);
                        setSpecializationSearchValue('');
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
                      <span>{spec.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {errors.specializations && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.specializations.message}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.isArray(specializationsField.value) && specializationsField.value.map((specValue: string) => {
            const spec = SPECIALIZATIONS.find(s => s.value === specValue);
            return (
              <Badge key={specValue} className="py-1 px-3 bg-[#4DA6A8] hover:bg-[#3D8A8C] text-white">
                {spec?.label || specValue}
                <button
                  type="button"
                  onClick={() => {
                    const newValues = specializationsField.value.filter((val: string) => val !== specValue);
                    specializationsField.onChange(newValues);
                  }}
                  className="ml-2 rounded-full hover:bg-[#3D8A8C]"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar</span>
                </button>
              </Badge>
            );
          })}
        </div>
      </div>
        
      {/* License Number */}
      <div className="space-y-2">
        <Label htmlFor="license_number" className="text-base">
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
      <div className="space-y-2">
        <Label htmlFor="license_document" className="text-base">Documento de licencia</Label>
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
      <div className="space-y-2">
        <Label htmlFor="years_of_experience" className="text-base">
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
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">Biografía profesional</Label>
        <Textarea
          id="bio"
          {...control.register('bio')}
          rows={4}
          placeholder="Describe tu experiencia profesional, enfoque de práctica, o cualquier información adicional relevante"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
