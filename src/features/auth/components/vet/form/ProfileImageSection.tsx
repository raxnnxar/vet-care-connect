
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';

interface ProfileImageSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  profileImageUrl?: string;
  setProfileImageFile: (file: File | null) => void;
  setValue: any;
  userId: string;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
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
      // Use the profile_pictures bucket with user folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile.${fileExt}`;
      
      const { error } = await supabase.storage
        .from('profile_pictures')
        .upload(fileName, file, {
          upsert: true // This allows overwriting existing profile pictures
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('profile_pictures')
        .getPublicUrl(fileName);

      setValue('profile_image_url', data.publicUrl);
      toast.success('Imagen de perfil actualizada');
    } catch (error: any) {
      toast.error('Error al subir la imagen: ' + error.message);
      console.error('Error uploading profile image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <Avatar className="w-32 h-32 border-4 border-white shadow-md">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} alt="Foto de perfil" />
          ) : (
            <AvatarFallback className="bg-[#79D0B8]/20 text-[#79D0B8] flex items-center justify-center text-3xl">
              VET
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
          <Upload className="h-5 w-5 text-white" />
        </label>
      </div>
      <p className="text-base text-gray-800 font-medium mt-4">
        Foto de perfil
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Añade una foto profesional para generar confianza
      </p>
    </div>
  );
};

export default ProfileImageSection;
