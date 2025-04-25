
import React, { useRef, useState } from 'react';
import { Label } from '@/ui/atoms/label';
import { FilePlus, AlertTriangle, Upload } from 'lucide-react';

interface VaccineUploadSectionProps {
  onFileUpload: (files: FileList | null) => Promise<void>;
  uploadingDocument: boolean;
  uploadedDocumentUrl: string | null;
  uploadError: string | null;
}

const VaccineUploadSection = ({
  onFileUpload,
  uploadingDocument,
  uploadedDocumentUrl,
  uploadError
}: VaccineUploadSectionProps) => {
  const vaccineDocInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor="vaccineDocument" className="font-medium text-base">
        Registro de vacunas
      </Label>
      <div className="flex flex-col gap-2">
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-primary transition-colors">
          <input
            id="vaccineDocument"
            ref={vaccineDocInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => onFileUpload(e.target.files)}
            className="hidden"
            disabled={uploadingDocument}
          />
          <Label 
            htmlFor="vaccineDocument" 
            className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground"
          >
            <Upload className="h-8 w-8" />
            <span>
              {uploadingDocument ? 'Subiendo...' : 'Subir documento de vacunas (PDF/Imagen)'}
            </span>
            <span className="text-xs text-muted-foreground">Máximo 5MB</span>
          </Label>
        </div>
        
        {uploadError && (
          <div className="bg-red-50 text-red-700 p-2 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
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

export default VaccineUploadSection;
