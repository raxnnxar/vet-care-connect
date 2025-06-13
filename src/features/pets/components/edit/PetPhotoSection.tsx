
import React from 'react';
import { Card } from '@/ui/molecules/card';
import { Camera } from 'lucide-react';

interface PetPhotoSectionProps {
  petName: string;
  photoPreview: string | null;
  onPhotoSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PetPhotoSection: React.FC<PetPhotoSectionProps> = ({
  petName,
  photoPreview,
  onPhotoSelect
}) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {photoPreview ? (
            <img 
              src={photoPreview} 
              alt={petName} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-white shadow-lg">
              <Camera size={32} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={onPhotoSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <p className="text-sm text-gray-500 text-center">
          Toca la imagen para cambiar la foto de perfil
        </p>
      </div>
    </Card>
  );
};

export default PetPhotoSection;
