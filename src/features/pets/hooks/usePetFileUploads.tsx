
import { useCallback } from 'react';
import { useAppDispatch } from '@/state/store';
import { uploadPetProfilePicture, uploadVaccineDocument } from '../store/petsThunks';
import { toast } from 'sonner';

export const usePetFileUploads = () => {
  const dispatch = useAppDispatch();
  
  const uploadProfilePicture = useCallback(async (petId: string, file: File): Promise<string | null> => {
    try {
      if (!petId) {
        console.error('Missing pet ID for profile picture upload');
        toast.error('Error: ID de mascota no disponible');
        return null;
      }

      console.log('Dispatching uploadPetProfilePicture with petId:', petId);
      const resultAction = await dispatch(uploadPetProfilePicture({ petId, file }));
      
      if (uploadPetProfilePicture.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;
        console.log('Profile picture uploaded successfully, URL:', url);
        return url;
      }
      
      console.error('Profile picture upload failed:', resultAction.error);
      toast.error('Error al subir la foto de perfil');
      return null;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Error al subir la foto de perfil');
      return null;
    }
  }, [dispatch]);
  
  const uploadVaccineDoc = useCallback(async (petId: string, file: File): Promise<string | null> => {
    try {
      if (!petId) {
        console.error('Missing pet ID for vaccine document upload');
        toast.error('Error: ID de mascota no disponible');
        return null;
      }
      
      console.log('Dispatching uploadVaccineDocument with petId:', petId, 'and file:', file.name);
      
      // Create a form data object for the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('petId', petId);
      
      // Directly attempt to upload via fetch to debug the issue
      try {
        const response = await fetch(`/api/pets/${petId}/vaccine-documents`, {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Direct upload successful, URL:', data.url);
          toast.success('Documento subido exitosamente');
          return data.url;
        } else {
          console.error('Direct upload failed:', response.statusText);
          // Fall back to the Redux approach
        }
      } catch (directError) {
        console.error('Direct upload attempt failed:', directError);
        // Continue with Redux approach
      }
      
      // If direct approach failed, try with Redux
      const resultAction = await dispatch(uploadVaccineDocument({ petId, file }));
      
      if (uploadVaccineDocument.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;
        console.log('Vaccine document uploaded successfully via Redux, URL:', url);
        return url;
      }
      
      console.error('Vaccine document upload failed:', resultAction.error);
      toast.error('Error al subir el documento de vacunas');
      return null;
    } catch (error: any) {
      console.error('Error uploading vaccine document:', error);
      toast.error('Error al subir el documento de vacunas: ' + (error?.message || 'Error desconocido'));
      return null;
    }
  }, [dispatch]);

  return {
    uploadProfilePicture,
    uploadVaccineDoc,
  };
};
