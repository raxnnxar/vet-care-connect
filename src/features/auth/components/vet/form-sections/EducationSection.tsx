import React, { useState } from 'react';
import { Control, Controller, FieldErrors, useFieldArray } from 'react-hook-form';
import { VeterinarianProfile, EducationEntry } from '../../../types/veterinarianTypes';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { PlusCircle, Loader2, Trash2, FileUp, FileCheck, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/molecules/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/molecules/alert-dialog';

interface EducationSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  setValue: any;
  userId: string;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  control,
  errors,
  setValue,
  userId
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [newEducation, setNewEducation] = useState<Omit<EducationEntry, 'id'>>({
    degree: '',
    institution: '',
    year: new Date().getFullYear()
  });
  const [newEducationFile, setNewEducationFile] = useState<File | null>(null);
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

  return (
    <div className="space-y-6">
      {fields.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">
            No has añadido ninguna formación académica. 
            Añade tu educación para generar confianza en los dueños de mascotas.
          </p>
          <Button 
            type="button" 
            onClick={() => setIsDialogOpen(true)} 
            variant="outline"
            className="mx-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Formación
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-3">
                  <CardTitle className="text-lg font-medium">{field.degree}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Institución</Label>
                      <p>{field.institution}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Año</Label>
                      <p>{field.year}</p>
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
                            onClick={() => document.getElementById(`education-doc-${field.id}`)?.click()}
                            disabled={isUploading[field.id]}
                            className="text-sm"
                            size="sm"
                          >
                            {isUploading[field.id] ? (
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
                            id={`education-doc-${field.id}`}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadDocument(field.id, file);
                              }
                            }}
                            disabled={isUploading[field.id]}
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
                    onClick={() => remove(index)}
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
              onClick={() => setIsDialogOpen(true)} 
              variant="outline"
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Formación
            </Button>
          </div>
        </>
      )}

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Añadir Formación Académica</AlertDialogTitle>
            <AlertDialogDescription>
              Añade detalles sobre tu formación académica para mostrar tus credenciales a los dueños de mascotas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
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
                      handleUploadNewEducationDocument(file);
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
                handleAddEducation();
              }}
            >
              Añadir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EducationSection;
