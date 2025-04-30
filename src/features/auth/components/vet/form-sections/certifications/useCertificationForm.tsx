import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { VeterinarianProfile, CertificationEntry } from '@/features/auth/types/veterinarianTypes';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface UseCertificationFormProps {
  control: Control<VeterinarianProfile>;
  setValue: any;
  userId: string;
}

export const useCertificationForm = ({ control, setValue, userId }: UseCertificationFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [newCertification, setNewCertification] = useState<Omit<CertificationEntry, 'id'>>({
    title: '',
    organization: '',
    issue_date: format(new Date(), 'yyyy-MM-dd'),
    expiry_date: '',
  });
  const [newCertificationFile, setNewCertificationFile] = useState<File | null>(null);
  const [newCertificationErrors, setNewCertificationErrors] = useState<Record<string, string>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications'
  });

  const certificationFields = fields as CertificationEntry[];

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewCertification({
      title: '',
      organization: '',
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      expiry_date: '',
    });
    setNewCertificationFile(null);
    setNewCertificationErrors({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setNewCertification(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (field: string, date: Date | undefined) => {
    if (date) {
      setNewCertification(prev => ({
        ...prev,
        [field]: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  const clearExpiryDate = () => {
    setNewCertification(prev => ({ ...prev, expiry_date: '' }));
  };

  const validateNewCertification = () => {
    const errors: Record<string, string> = {};

    if (!newCertification.title.trim()) {
      errors.title = 'El título es requerido';
    }

    if (!newCertification.organization.trim()) {
      errors.organization = 'La organización es requerida';
    }

    if (!newCertification.issue_date) {
      errors.issue_date = 'La fecha de emisión es requerida';
    }

    setNewCertificationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCertification = () => {
    if (validateNewCertification()) {
      const newCertId = uuidv4();
      
      // Create the new certification object
      const newCert: CertificationEntry = {
        id: newCertId,
        ...newCertification,
        document_url: undefined
      };
      
      // Add it to the form
      append(newCert);
      
      // If there's a file to upload, do that too
      if (newCertificationFile) {
        handleUploadDocument(newCertId, newCertificationFile);
      }
      
      closeDialog();
    }
  };
  
  const handleFileSelect = (file: File) => {
    setNewCertificationFile(file);
    toast.success('Documento seleccionado. Se subirá cuando añadas la certificación.');
  };

  const handleUploadDocument = async (certificationId: string, file: File) => {
    if (!file) return;
    
    setIsUploading(prev => ({ ...prev, [certificationId]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/certification-${certificationId}-${Date.now()}.${fileExt}`;
      const filePath = `certifications/${fileName}`;
      
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
      
      // Find the index of the certification in the fields array
      const index = fields.findIndex(f => f.id === certificationId);
      
      if (index !== -1) {
        // Update the document_url for the specific certification entry
        setValue(`certifications.${index}.document_url`, urlData.publicUrl);
      }
      
      toast.success('Certificación subida con éxito');
      
    } catch (error: any) {
      console.error('Error uploading certification document:', error);
      toast.error(`Error al subir el documento: ${error.message}`);
    } finally {
      setIsUploading(prev => ({ ...prev, [certificationId]: false }));
    }
  };

  return {
    certificationFields,
    isDialogOpen,
    setIsDialogOpen,
    isUploading,
    newCertification,
    newCertificationFile,
    newCertificationErrors,
    openDialog,
    closeDialog,
    handleFieldChange,
    handleDateSelect,
    clearExpiryDate,
    handleFileSelect,
    handleAddCertification,
    handleUploadDocument,
    removeCertification: remove
  };
};
