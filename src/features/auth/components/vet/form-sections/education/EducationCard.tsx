
import React from 'react';
import { Controller } from 'react-hook-form';
import { FileCheck, FileUp, ExternalLink, Trash2, Loader2 } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { Button } from '@/ui/atoms/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/molecules/card';
import { EducationEntry } from '../../../../types/veterinarianTypes';

interface EducationCardProps {
  education: EducationEntry;
  index: number;
  isUploading: boolean;
  onDelete: () => void;
  onUpload: (file: File) => void;
  control: any;
}

const EducationCard: React.FC<EducationCardProps> = ({
  education,
  index,
  isUploading,
  onDelete,
  onUpload,
  control
}) => {
  return (
    <Card key={education.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50 pb-3">
        <CardTitle className="text-lg font-medium">{education.degree}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-500">Institución</Label>
            <p>{education.institution}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Año</Label>
            <p>{education.year}</p>
          </div>
        </div>

        <div className="mt-4">
          <Label className="text-sm text-gray-500">Documento</Label>
          <Controller
            name={`education.${index}.document_url`}
            control={control}
            render={({ field: docField }) => (
              <div className="mt-1 flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById(`education-doc-${education.id}`)?.click()}
                  disabled={isUploading}
                  className="text-sm"
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Subiendo...
                    </>
                  ) : docField.value ? (
                    <>
                      <FileCheck className="mr-2 h-3 w-3 text-green-500" />
                      Documento Subido
                    </>
                  ) : (
                    <>
                      <FileUp className="mr-2 h-3 w-3" />
                      Subir Documento
                    </>
                  )}
                </Button>
                
                <input
                  id={`education-doc-${education.id}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onUpload(file);
                    }
                  }}
                  disabled={isUploading}
                />
                
                {docField.value && (
                  <a 
                    href={docField.value} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Ver documento
                  </a>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t bg-gray-50 py-2">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onDelete}
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EducationCard;
