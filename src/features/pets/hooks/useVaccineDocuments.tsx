
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { vaccineDocumentsApi, VaccineDocument } from '../api/vaccineDocumentsApi';
import { toast } from 'sonner';

export const useVaccineDocuments = (petId: string) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [documents, setDocuments] = useState<VaccineDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fetchDocuments = useCallback(async () => {
    if (!petId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await vaccineDocumentsApi.getVaccineDocuments(petId);
      
      if (error) {
        console.error('Error fetching vaccine documents:', error);
        toast.error('Error al cargar los documentos');
        return;
      }
      
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching vaccine documents:', error);
      toast.error('Error al cargar los documentos');
    } finally {
      setIsLoading(false);
    }
  }, [petId]);
  
  const uploadDocument = useCallback(async (file: File, notes?: string): Promise<boolean> => {
    if (!petId) {
      toast.error('Error: ID de mascota no disponible');
      return false;
    }
    
    setIsUploading(true);
    try {
      const { data, error } = await vaccineDocumentsApi.uploadVaccineDocument(petId, file, notes);
      
      if (error) {
        console.error('Error uploading vaccine document:', error);
        toast.error('No se pudo subir el documento. Revisa el archivo o vuelve a intentarlo.');
        return false;
      }
      
      if (data) {
        setDocuments(prev => [data, ...prev]);
        toast.success('Documento subido exitosamente');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error uploading vaccine document:', error);
      toast.error('No se pudo subir el documento. Revisa el archivo o vuelve a intentarlo.');
      return false;
    } finally {
      setIsUploading(false);
    }
  }, [petId]);
  
  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      const { error } = await vaccineDocumentsApi.deleteVaccineDocument(documentId);
      
      if (error) {
        console.error('Error deleting vaccine document:', error);
        toast.error('Error al eliminar el documento');
        return false;
      }
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Documento eliminado exitosamente');
      return true;
    } catch (error) {
      console.error('Error deleting vaccine document:', error);
      toast.error('Error al eliminar el documento');
      return false;
    }
  }, []);
  
  const updateDocumentNotes = useCallback(async (documentId: string, notes: string): Promise<boolean> => {
    try {
      const { data, error } = await vaccineDocumentsApi.updateVaccineDocument(documentId, notes);
      
      if (error) {
        console.error('Error updating vaccine document:', error);
        toast.error('Error al actualizar las notas');
        return false;
      }
      
      if (data) {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? data : doc
        ));
        toast.success('Notas actualizadas exitosamente');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating vaccine document:', error);
      toast.error('Error al actualizar las notas');
      return false;
    }
  }, []);
  
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);
  
  return {
    documents,
    isLoading,
    isUploading,
    uploadDocument,
    deleteDocument,
    updateDocumentNotes,
    refetchDocuments: fetchDocuments
  };
};
