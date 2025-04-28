
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/atoms/avatar';

interface PetPhotoUploadProps {
  photoPreview: string | null;
  onPhotoSelect: (file: File) => void;
}

const PetPhotoUpload: React.FC<PetPhotoUploadProps> = ({ photoPreview, onPhotoSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-white/30">
          {photoPreview ? (
            <AvatarImage 
              src={photoPreview} 
              alt="Foto de mascota" 
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-white/40">
              <Upload className="h-6 w-6 text-white" />
            </AvatarFallback>
          )}
        </Avatar>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-0 right-0 bg-white text-primary rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
        >
          <Upload className="h-3 w-3" />
        </button>
        
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      <p className="text-xs text-white">
        {photoPreview ? "Foto seleccionada" : "Añadir una foto de tu mascota"}
      </p>
    </div>
  );
};

export default PetPhotoUpload;
