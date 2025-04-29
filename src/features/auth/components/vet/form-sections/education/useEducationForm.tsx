
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EducationEntry } from '../../../../types/veterinarianTypes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useFieldArray } from 'react-hook-form';

export const useEducationForm = (control, setValue, userId) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [newEducationFile, setNewEducationFile] = useState<File | null>(null);
  const [newEducation, setNewEducation] = useState<Omit<EducationEntry, 'id'>>({
    degree: '',
    institution: '',
    year: new Date().getFullYear()
  });
  const [newEducationErrors, setNewEducationErrors] = useState<Record<string, string>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  const validateNewEducation = () => {
    const errors: Record<string, string> = {};

    if (!newEducation.degree.trim()) {
      errors.degree = 'El título es requerido';
    }

    if (!newEducation.institution.trim()) {
      errors.institution = 'La institución es requerida';
    }

    const currentYear = new Date().getFullYear();
    if (!newEducation.year || newEducation.year < 1950 || newEducation.year > currentYear) {
      errors.year = `El año debe estar entre 1950 y ${currentYear}`;
    }

    setNewEducationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEducation = () => {
    if (validateNewEducation()) {
      append({
        id: uuidv4(),
        ...newEducation,
        document_url: undefined
      });
      
      setNewEducation({
        degree: '',
        institution: '',
        year: new Date().getFullYear()
      });
      setNewEducationFile(null);
      setIsDialogOpen(false);
    }
  };

  const handleUploadDocument = async (educationId: string, file: File) => {
    if (!file) return;
    
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
      
      const index = fields.findIndex(f => f.id === educationId);
      
      if (index !== -1) {
        setValue(`education.${index}.document_url`, urlData.publicUrl);
      }
      
      toast.success('Documento educativo subido con éxito');
      
    } catch (error: any) {
      console.error('Error uploading education document:', error);
      toast.error(`Error al subir el documento: ${error.message}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [educationId]: false }));
    }
  };

  const handleUploadNewEducationDocument = async (file: File) => {
    if (!file) return;
    setNewEducationFile(file);
    toast.success('Documento seleccionado. Se subirá cuando añadas la educación.');
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
