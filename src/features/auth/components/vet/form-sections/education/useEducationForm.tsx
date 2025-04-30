
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EducationErrors {
  degree?: string;
  institution?: string;
  year?: string;
}

export const useEducationForm = (control: Control<VeterinarianProfile>, setValue: any, userId: string) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [newEducation, setNewEducation] = useState({
    degree: '',
    institution: '',
    year: new Date().getFullYear(),
  });
  const [newEducationFile, setNewEducationFile] = useState<File | null>(null);
  const [newEducationErrors, setNewEducationErrors] = useState<EducationErrors>({});
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });
  
  const validateEducation = () => {
    const errors: EducationErrors = {};
    
    // We're making fields optional now, so returning true
    return true;
  };
  
  const handleAddEducation = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (validateEducation()) {
      const newEducationId = uuidv4();
      
      append({
        id: newEducationId,
        degree: newEducation.degree,
        institution: newEducation.institution,
        year: newEducation.year,
      });
      
      if (newEducationFile) {
        handleUploadNewEducationDocument(newEducationFile, newEducationId);
      }
      
      setIsDialogOpen(false);
      setNewEducation({
        degree: '',
        institution: '',
        year: new Date().getFullYear(),
      });
      setNewEducationFile(null);
    }
  };
  
  const handleUploadDocument = async (educationId: string, file: File) => {
    if (!file || !userId) return;
    
    setIsUploading(prev => ({ ...prev, [educationId]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/education-${educationId}-${Date.now()}.${fileExt}`;
      const filePath = `education/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vet-documents')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('vet-documents')
        .getPublicUrl(filePath);
      
      // Find the index of the education in the fields array
      const index = fields.findIndex(f => f.id === educationId);
      
      if (index !== -1) {
        // Update the document_url for the specific education entry
        setValue(`education.${index}.document_url`, urlData.publicUrl);
      }
      
      toast.success('Documento subido con éxito');
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(`Error al subir el documento: ${error.message}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [educationId]: false }));
    }
  };
  
  const handleUploadNewEducationDocument = async (file: File, educationId?: string) => {
    setNewEducationFile(file);
    if (educationId) {
      handleUploadDocument(educationId, file);
    }
  };
  
  return {
    fields,
    isDialogOpen,
    setIsDialogOpen,
    isUploading,
    newEducation,
    setNewEducation,
    newEducationFile,
    newEducationErrors,
    handleAddEducation,
    handleUploadDocument,
    handleUploadNewEducationDocument,
    remove
  };
};
