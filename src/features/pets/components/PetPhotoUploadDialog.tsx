
import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/molecules/alert-dialog';
import { Button } from '@/ui/atoms/button';
import { supabase } from '@/integrations/supabase/client';
import { petsApi } from '../api/petsApi';

interface PetPhotoUploadDialogProps {
  isOpen: boolean;
  petId: string;
  petName: string;
  onClose: (wasPhotoAdded: boolean) => void;
}

const PetPhotoUploadDialog = ({ 
  isOpen, 
  petId, 
  petName,
  onClose 
}: PetPhotoUploadDialogProps) => {
  const [showFileSelector, setShowFileSelector] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle when user clicks "Sí" to add a photo
  const handleAddPhoto = () => {
    setShowFileSelector(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview selected image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        setImageFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset the state
  const resetState = () => {
    setSelectedImage(null);
    setImageFile(null);
    setShowFileSelector(false);
    setIsUploading(false);
  };

  // Handle upload cancellation
  const handleCancel = () => {
    resetState();
    onClose(false);
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Upload the selected photo to Supabase storage
  const handleUpload = async () => {
    if (!imageFile || !petId) return;
    
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const filePath = `${petId}/profile.${fileExt}`;
      
      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('pet-profile-pictures')
        .upload(filePath, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });
      
      if (error) throw error;
      
      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from('pet-profile-pictures')
        .getPublicUrl(filePath);
      
      if (!publicUrlData.publicUrl) {
        throw new Error('No se pudo obtener la URL de la imagen');
      }
      
      // Update pet profile with the image URL
      const updateResult = await petsApi.updatePet(petId, {
        profile_picture_url: publicUrlData.publicUrl
      });
      
      if (updateResult.error) {
        throw updateResult.error;
      }
      
      toast.success('Foto de mascota guardada exitosamente');
      resetState();
      onClose(true);
    } catch (error) {
      console.error('Error uploading pet photo:', error);
      toast.error('Error al subir la foto. Por favor intenta nuevamente.');
      setIsUploading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose(false)}>
      <AlertDialogContent className="max-w-md">
        {!showFileSelector ? (
          // Initial dialog asking if user wants to add a photo
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Quieres agregar una foto para tu mascota?</AlertDialogTitle>
              <AlertDialogDescription>
                Puedes agregar una foto para personalizar el perfil de {petName}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Ahora no</AlertDialogCancel>
              <AlertDialogAction onClick={handleAddPhoto}>Sí</AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          // Photo upload interface
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar foto de {petName}</AlertDialogTitle>
              <AlertDialogDescription>
                Selecciona una imagen para tu mascota.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="my-4">
              {selectedImage ? (
                // Image preview
                <div className="relative mx-auto max-w-[250px] max-h-[250px]">
                  <div className="rounded-md overflow-hidden">
                    <img 
                      src={selectedImage} 
                      alt="Vista previa" 
                      className="w-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedImage(null);
                      setImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 rounded-full bg-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                // Upload button when no image is selected
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Haz clic para seleccionar una imagen
                    </div>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <AlertDialogFooter>
              <Button variant="ghost" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedImage || isUploading}
                className="bg-primary text-white"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Guardar foto
                  </>
                )}
              </Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PetPhotoUploadDialog;
