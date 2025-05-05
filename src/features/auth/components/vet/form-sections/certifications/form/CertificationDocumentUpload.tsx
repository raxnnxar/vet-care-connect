
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import { FileUp, FileCheck } from 'lucide-react';

interface CertificationDocumentUploadProps {
  certificationFile: File | null;
  onFileSelect: (file: File) => void;
}

const CertificationDocumentUpload: React.FC<CertificationDocumentUploadProps> = ({
  certificationFile,
  onFileSelect
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="document">Documento (Opcional)</Label>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => document.getElementById('new-certification-doc')?.click()}
        >
          {certificationFile ? (
            <>
              <FileCheck className="mr-2 h-4 w-4 text-green-500" />
              {certificationFile.name}
            </>
          ) : (
            <>
              <FileUp className="mr-2 h-4 w-4" />
              Subir Documento
            </>
          )}
        </Button>
        
        <input
          id="new-certification-doc"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onFileSelect(file);
            }
          }}
        />
      </div>
      <p className="text-xs text-gray-500">
        Puedes subir un certificado o credencial (.pdf, .jpg, .png)
      </p>
    </div>
  );
};

export default CertificationDocumentUpload;
