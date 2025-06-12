
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
      
      // Use the Redux thunk for vaccine document upload
      const resultAction = await dispatch(uploadVaccineDocument({ petId, file }));
      
      if (uploadVaccineDocument.fulfilled.match(resultAction)) {
        const { url } = resultAction.payload;
        console.log('Vaccine document uploaded successfully via Redux, URL:', url);
        toast.success('Documento subido exitosamente');
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
