
import React, { useState } from 'react';
import { FileCheck, FileUp } from 'lucide-react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import {
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/molecules/alert-dialog';

interface EducationErrors {
  degree?: string;
  institution?: string;
  year?: string;
}

interface EducationFormProps {
  newEducation: {
    degree: string;
    institution: string;
    year: number;
  };
  setNewEducation: React.Dispatch<React.SetStateAction<{
    degree: string;
    institution: string;
    year: number;
  }>>;
  newEducationFile: File | null;
  newEducationErrors: EducationErrors;
  onFileSelect: (file: File) => void;
  onSubmit: (e: React.MouseEvent) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  newEducation,
  setNewEducation,
  newEducationFile,
  newEducationErrors,
  onFileSelect,
  onSubmit
}) => {
  return (
    <>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="degree">
            Título/Grado <span className="text-red-500">*</span>
          </Label>
          <Input
            id="degree"
            value={newEducation.degree}
            onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
            placeholder="Ej. Médico Veterinario, Especialista en Cardiología, etc."
            className={newEducationErrors.degree ? "border-red-500" : ""}
          />
          {newEducationErrors.degree && (
            <p className="text-sm text-red-500">{newEducationErrors.degree}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">
            Institución <span className="text-red-500">*</span>
          </Label>
          <Input
            id="institution"
            value={newEducation.institution}
            onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
            placeholder="Ej. Universidad Nacional Autónoma de México"
            className={newEducationErrors.institution ? "border-red-500" : ""}
          />
          {newEducationErrors.institution && (
            <p className="text-sm text-red-500">{newEducationErrors.institution}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">
            Año <span className="text-red-500">*</span>
          </Label>
          <Input
            id="year"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            value={newEducation.year}
            onChange={(e) => setNewEducation(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
            className={newEducationErrors.year ? "border-red-500" : ""}
          />
          {newEducationErrors.year && (
            <p className="text-sm text-red-500">{newEducationErrors.year}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">Documento (Opcional)</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => document.getElementById('new-education-doc')?.click()}
            >
              {newEducationFile ? (
                <>
                  <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                  {newEducationFile.name}
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4" />
                  Subir Documento
                </>
              )}
            </Button>
            
            <input
              id="new-education-doc"
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
            Puedes subir un diploma, título o certificado (.pdf, .jpg, .png)
          </p>
        </div>
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        >
          Añadir
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default EducationForm;
