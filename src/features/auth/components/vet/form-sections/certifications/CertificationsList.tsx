
import React from 'react';
import { CertificationEntry } from '@/features/auth/types/veterinarianTypes';
import { Button } from '@/ui/atoms/button';
import { PlusCircle, FileCheck, Trash2, ExternalLink, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/molecules/card';
import { Label } from '@/ui/atoms/label';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CertificationsListProps {
  certifications: CertificationEntry[];
  isUploading: Record<string, boolean>;
  onAddClick: () => void;
  onRemoveCertification: (index: number) => void;
  onUploadDocument: (certificationId: string, file: File) => Promise<void>;
}

const CertificationsList: React.FC<CertificationsListProps> = ({
  certifications,
  isUploading,
  onAddClick,
  onRemoveCertification,
  onUploadDocument
}) => {
  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {certifications.map((certification, index) => (
          <Card key={certification.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 pb-3">
              <CardTitle className="text-lg font-medium">{certification.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Organización</Label>
                  <p>{certification.organization}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Fecha de Emisión</Label>
                  <p>{formatDate(certification.issue_date)}</p>
                </div>
              </div>

              {certification.expiry_date && (
                <div className="mt-3">
                  <Label className="text-sm text-gray-500">Fecha de Vencimiento</Label>
                  <p>{formatDate(certification.expiry_date)}</p>
                </div>
              )}

              <div className="mt-4">
                <Label className="text-sm text-gray-500">Documento</Label>
                <div className="mt-1 flex items-center gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById(`certification-doc-${certification.id}`)?.click()}
                    disabled={isUploading[certification.id]}
                    className="text-sm"
                    size="sm"
                  >
                    {isUploading[certification.id] ? (
                      <>
                        <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                        Subiendo...
                      </>
                    ) : certification.document_url ? (
                      <>
                        <FileCheck className="mr-2 h-3 w-3 text-green-500" />
                        Documento Subido
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-3 w-3" />
                        Subir Documento
                      </>
                    )}
                  </Button>
                  
                  <input
                    id={`certification-doc-${certification.id}`}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onUploadDocument(certification.id, file);
                      }
                    }}
                    disabled={isUploading[certification.id]}
                  />
                  
                  {certification.document_url && (
                    <a 
                      href={certification.document_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Ver documento
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t bg-gray-50 py-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onRemoveCertification(index)}
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <Button 
          type="button" 
          onClick={onAddClick} 
          variant="outline"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Certificación
        </Button>
      </div>
    </>
  );
};

export default CertificationsList;
