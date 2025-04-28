
import React, { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { toast } from 'sonner';
import { usePets } from '../../hooks';

interface VaccineDocumentUploadProps {
  petId: string;
}

const VaccineDocumentUpload = ({ petId }: VaccineDocumentUploadProps) => {
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { uploadVaccineDoc } = usePets();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      setUploadError('No se seleccionó ningún archivo');
      return;
    }

    const file = files[0];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSizeInBytes) {
      setUploadError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    setUploadingDocument(true);
    setUploadError(null);
    
    try {
      console.log('Uploading vaccine document for pet:', petId);
      const documentUrl = await uploadVaccineDoc(petId, file);
      
      if (documentUrl) {
        console.log('Upload successful, URL:', documentUrl);
        setUploadedDocumentUrl(documentUrl);
        toast.success('Documento subido exitosamente');
      } else {
        console.error('Upload returned no URL');
        setUploadError('Error al subir el documento');
        toast.error('Error al subir el documento');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError('Error al subir el documento');
      toast.error('Error al subir el documento');
    } finally {
      setUploadingDocument(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="vaccineDocument" className="font-medium text-base">
        Registro de vacunas
      </Label>
      <div className="flex flex-col gap-2">
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-primary transition-colors">
          <input
            id="vaccineDocument"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploadingDocument}
          />
          <Label 
            htmlFor="vaccineDocument" 
            className="cursor-pointer flex flex-col items-center gap-2 text-gray-500"
          >
            <FilePlus className="h-8 w-8 text-gray-400" />
            <span className="text-base">
              Subir documento de vacunas (PDF/Imagen)
            </span>
            <span className="text-xs text-gray-400">Máximo 5MB</span>
          </Label>
        </div>
        
        {uploadError && (
          <div className="bg-red-50 text-red-700 p-2 rounded-md flex items-center gap-2">
            <span className="text-sm">{uploadError}</span>
          </div>
        )}
        
        {uploadedDocumentUrl && (
          <div className="bg-green-50 text-green-700 p-2 rounded-md flex items-center gap-2">
            <FilePlus className="h-4 w-4" />
            <a 
              href={uploadedDocumentUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm underline hover:text-green-800"
            >
              Documento subido exitosamente - Ver documento
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccineDocumentUpload;
