
import React, { useRef, useState } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';

interface ProfileImageUploaderProps {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  setProfileImageFile: (file: File | null) => void;
  isUploading: boolean;
  displayName?: string;
}

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  profileImage,
  setProfileImage,
  setProfileImageFile,
  isUploading,
  displayName,
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      setProfileImageFile(file);
      
    } catch (error) {
      console.error('Error handling image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <div className="relative mb-4">
        <Avatar className="h-28 w-28 border-4 border-primary/30">
          <AvatarImage src={profileImage || undefined} alt="Foto de perfil" className="object-cover" />
          <AvatarFallback className="bg-primary/20 text-primary text-3xl">
            {displayName ? getInitials(displayName) : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors"
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
      <p className="text-sm text-muted-foreground">Agrega una foto de perfil</p>
      
      {isUploading && (
        <div className="mt-2 flex items-center text-sm text-primary">
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          <span>Subiendo imagen...</span>
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
