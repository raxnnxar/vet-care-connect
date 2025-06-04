
import React from 'react';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { GroomingProfile } from '../../types/groomingTypes';

interface GroomingProfileImageSectionProps {
  control: Control<GroomingProfile>;
  errors: FieldErrors<GroomingProfile>;
  profileImageUrl: string | undefined;
  setProfileImageFile: (file: File | null) => void;
  setValue: UseFormSetValue<GroomingProfile>;
  userId: string;
}

const GroomingProfileImageSection: React.FC<GroomingProfileImageSectionProps> = ({
  control,
  errors,
  profileImageUrl,
  setProfileImageFile,
  setValue,
  userId,
}) => {
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
        .from('profile_pictures')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(filePath);

      setValue('profile_image_url', data.publicUrl);
      toast.success('Imagen de perfil actualizada');
    } catch (error: any) {
      toast.error('Error al subir la imagen: ' + error.message);
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
          {profileImageUrl ? (
            <img 
              src={profileImageUrl} 
              alt="Perfil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
      </div>
      
      <div className="text-center">
        <Label htmlFor="profile_image" className="text-base font-medium text-gray-700">
          Foto de perfil (opcional)
        </Label>
        <p className="text-sm text-gray-500 mt-1">
          Máximo 5MB. Formatos: JPG, PNG
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          id="profile_image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleProfileImageChange}
        />
        <label
          htmlFor="profile_image"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#79D0B8] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5FBFB3] cursor-pointer"
        >
          <Upload className="mr-2 h-4 w-4" />
          {profileImageUrl ? 'Cambiar foto' : 'Subir foto'}
        </label>
      </div>
    </div>
  );
};

export default GroomingProfileImageSection;
