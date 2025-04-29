
import React, { useState } from 'react';
import { Control, Controller, FieldErrors, useFieldArray } from 'react-hook-form';
import { VeterinarianProfile, CertificationEntry } from '../../../types/veterinarianTypes';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { PlusCircle, Loader2, Trash2, FileUp, FileCheck, ExternalLink, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';
import { Calendar as CalendarComponent } from '@/ui/molecules/calendar';

interface CertificationsSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  setValue: any;
  userId: string;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  control,
  errors,
  setValue,
  userId
}) => {
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
      append({
        id: uuidv4(),
        ...newCertification,
        document_url: undefined
      });
      
      setNewCertification({
        title: '',
        organization: '',
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        expiry_date: '',
      });
      setNewCertificationFile(null);
      setIsDialogOpen(false);
    }
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

  const handleUploadNewCertificationDocument = async (file: File) => {
    if (!file) return;
    setNewCertificationFile(file);
    toast.success('Documento seleccionado. Se subirá cuando añadas la certificación.');
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {fields.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-6">
            No has añadido ninguna certificación. 
            Las certificaciones muestran tu especialización y dedicación profesional.
          </p>
          <Button 
            type="button" 
            onClick={() => setIsDialogOpen(true)} 
            variant="outline"
            className="mx-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Certificación
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <CardTitle className="text-lg font-medium">{field.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Organización</Label>
                    <p>{field.organization}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Fecha de Emisión</Label>
                    <p>{formatDate(field.issue_date)}</p>
                  </div>
                </div>

                {field.expiry_date && (
                  <div className="mt-3">
                    <Label className="text-sm text-gray-500">Fecha de Vencimiento</Label>
                    <p>{formatDate(field.expiry_date)}</p>
                  </div>
                )}

                <div className="mt-4">
                  <Label className="text-sm text-gray-500">Documento</Label>
                  <Controller
                    name={`certifications.${index}.document_url`}
                    control={control}
                    render={({ field: docField }) => (
                      <div className="mt-1 flex items-center gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => document.getElementById(`certification-doc-${field.id}`)?.click()}
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
                          id={`certification-doc-${field.id}`}
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

          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={() => setIsDialogOpen(true)} 
              variant="outline"
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Certificación
            </Button>
          </div>
        </div>
      )}

      {/* Add Certification Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Añadir Certificación</AlertDialogTitle>
            <AlertDialogDescription>
              Añade detalles sobre tus certificaciones profesionales para mostrar tu especialización.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título de la Certificación <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={newCertification.title}
                onChange={(e) => setNewCertification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ej. Certificación en Cirugía Avanzada"
                className={newCertificationErrors.title ? "border-red-500" : ""}
              />
              {newCertificationErrors.title && (
                <p className="text-sm text-red-500">{newCertificationErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">
                Organización <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organization"
                value={newCertification.organization}
                onChange={(e) => setNewCertification(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Ej. Asociación Veterinaria Mexicana"
                className={newCertificationErrors.organization ? "border-red-500" : ""}
              />
              {newCertificationErrors.organization && (
                <p className="text-sm text-red-500">{newCertificationErrors.organization}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">
                  Fecha de Emisión <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left ${
                        newCertificationErrors.issue_date ? "border-red-500" : ""
                      }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newCertification.issue_date ? (
                        formatDate(newCertification.issue_date)
                      ) : (
                        <span>Seleccionar Fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newCertification.issue_date ? new Date(newCertification.issue_date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setNewCertification(prev => ({
                            ...prev,
                            issue_date: format(date, 'yyyy-MM-dd')
                          }));
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {newCertificationErrors.issue_date && (
                  <p className="text-sm text-red-500">{newCertificationErrors.issue_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">Fecha de Vencimiento (Opcional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {newCertification.expiry_date ? (
                        formatDate(newCertification.expiry_date)
                      ) : (
                        <span>Seleccionar Fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newCertification.expiry_date ? new Date(newCertification.expiry_date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setNewCertification(prev => ({
                            ...prev,
                            expiry_date: format(date, 'yyyy-MM-dd')
                          }));
                        } else {
                          setNewCertification(prev => ({ ...prev, expiry_date: '' }));
                        }
                      }}
                      disabled={(date) => {
                        if (!newCertification.issue_date) return true;
                        return date < new Date(newCertification.issue_date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setNewCertification(prev => ({ ...prev, expiry_date: '' }))}
                  className="mt-1 text-xs text-gray-500 hover:text-gray-700 h-7"
                >
                  Limpiar fecha
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Documento (Opcional)</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={() => document.getElementById('new-certification-doc')?.click()}
                >
                  {newCertificationFile ? (
                    <>
                      <FileCheck className="mr-2 h-4 w-4 text-green-500" />
                      {newCertificationFile.name}
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
                      handleUploadNewCertificationDocument(file);
                    }
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Puedes subir un certificado o credencial (.pdf, .jpg, .png)
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleAddCertification();
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

export default CertificationsSection;
