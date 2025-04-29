
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface LicenseDocumentUploadProps {
  licenseDocumentUrl: string | undefined;
  setLicenseDocumentFile: (file: File | null) => void;
  setValue: any;
  userId: string;
}

const LicenseDocumentUpload: React.FC<LicenseDocumentUploadProps> = ({
  licenseDocumentUrl,
  setLicenseDocumentFile,
  setValue,
  userId,
}) => {
  const handleLicenseDocumentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const fileSize = file.size / 1024 / 1024; // in MB
    
    if (fileSize > 10) {
      toast.error('El documento no debe exceder 10MB');
      return;
    }
    
    setLicenseDocumentFile(file);
    
    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('vet-license-documents')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      const { data } = supabase.storage
        .from('vet-license-documents')
        .getPublicUrl(filePath);

      setValue('license_document_url', data.publicUrl);
      toast.success('Documento de licencia actualizado');
    } catch (error: any) {
      toast.error('Error al subir el documento: ' + error.message);
      console.error('Error uploading license document:', error);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="license_document" className="text-base">Documento de licencia</Label>
      <div className="flex items-center gap-2">
        <Input
          id="license_document"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleLicenseDocumentChange}
        />
        <div className={`flex-1 border rounded-md h-10 px-3 py-2 text-sm ${licenseDocumentUrl ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
          {licenseDocumentUrl ? 'Documento subido' : 'Ningún documento seleccionado'}
        </div>
        <label
          htmlFor="license_document"
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#79D0B8] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5FBFB3] cursor-pointer"
        >
          <Upload className="mr-2 h-4 w-4" />
          Subir
        </label>
      </div>
      {licenseDocumentUrl && (
        <div className="text-xs text-green-600 flex items-center mt-1">
          <a href={licenseDocumentUrl} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
            Ver documento
          </a>
        </div>
      )}
    </div>
  );
};

export default LicenseDocumentUpload;
