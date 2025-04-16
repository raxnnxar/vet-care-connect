
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/molecules/dialog';
import { Button } from '@/ui/atoms/button';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { usePets } from '../hooks/usePets';

interface PetPhotoUploadDialogProps {
  isOpen: boolean;
  petId: string;
  petName: string;
  onClose: (wasPhotoAdded: boolean) => void;
}

const PetPhotoUploadDialog: React.FC<PetPhotoUploadDialogProps> = ({
  isOpen,
  petId,
  petName,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { uploadProfilePicture } = usePets();

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      await uploadProfilePicture(petId, selectedFile);
      
      toast.success('¡Foto de perfil subida con éxito!');
      onClose(true);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error al subir la foto. Por favor intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSkip = () => {
    onClose(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isUploading && onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Quieres agregar una foto para {petName}?</DialogTitle>
          <DialogDescription>
            Sube una foto para identificar fácilmente a tu mascota.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-6">
          {previewUrl ? (
            <div className="relative">
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                className="w-full h-48 object-cover rounded-md" 
              />
              <button 
                onClick={clearSelection}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-primary transition-colors">
              <input
                id="pet-photo"
                type="file"
                accept="image/*"
                onChange={handleFileSelection}
                className="hidden"
              />
              <label 
                htmlFor="pet-photo" 
                className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Upload className="h-8 w-8" />
                <span>Haz clic para seleccionar una foto</span>
                <span className="text-xs">JPG, PNG (max. 5MB)</span>
              </label>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between flex flex-row">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            disabled={isUploading}
          >
            Ahora no
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              'Subir foto'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PetPhotoUploadDialog;
