
import React, { useRef, useState } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileImageUploaderProps {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  setProfileImageFile: (file: File | null) => void;
  isUploading: boolean;
  displayName?: string;
  userId?: string;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  profileImage,
  setProfileImage,
  setProfileImageFile,
  isUploading,
  displayName,
  userId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 5) {
      toast.error('La imagen no debe exceder 5MB');
      return;
    }
    
    try {
      // Create preview URL for immediate display
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      setProfileImageFile(file);
      
      // If userId is provided, upload to Supabase
      if (userId) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/profile.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('profile_pictures')
          .upload(fileName, file, {
            upsert: true
          });

        if (error) {
          throw error;
        }

        const { data } = supabase.storage
          .from('profile_pictures')
          .getPublicUrl(fileName);

        setProfileImage(data.publicUrl);
        toast.success('Imagen de perfil actualizada');
      }
      
    } catch (error: any) {
      console.error('Error handling image:', error);
      toast.error('Error al procesar la imagen: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-4">
        <Avatar className="h-28 w-28 border-4 border-white/30">
          <AvatarImage src={profileImage || undefined} alt="Foto de perfil" className="object-cover" />
          <AvatarFallback className="bg-white/40 text-white text-3xl shadow-inner">
            {displayName ? getInitials(displayName) : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-white text-primary rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Cambiar foto de perfil"
        >
          <Pencil className="h-4 w-4" />
        </button>
        
        <input 
          ref={fileInputRef}
          id="profile-image" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageUpload}
        />
      </div>
      <p className="text-sm text-white">Agrega una foto de perfil</p>
      
      {isUploading && (
        <div className="mt-2 flex items-center text-sm text-white">
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          <span>Subiendo imagen...</span>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
