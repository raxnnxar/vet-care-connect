
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Button } from '@/ui/atoms/button';
import { Calendar, FileUp, FileCheck } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/molecules/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/molecules/popover';
import { Calendar as CalendarComponent } from '@/ui/molecules/calendar';

interface CertificationFormProps {
  title: string;
  organization: string;
  issueDate: string;
  expiryDate: string;
  errors: Record<string, string>;
  certificationFile: File | null;
  onFieldChange: (field: string, value: string) => void;
  onDateSelect: (field: string, date: Date | undefined) => void;
  onClearExpiryDate: () => void;
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({
  title,
  organization,
  issueDate,
  expiryDate,
  errors,
  certificationFile,
  onFieldChange,
  onDateSelect,
  onClearExpiryDate,
  onFileSelect,
  onCancel,
  onSubmit
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
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="title">
            Título de la Certificación <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Ej. Certificación en Cirugía Avanzada"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">
            Organización <span className="text-red-500">*</span>
          </Label>
          <Input
            id="organization"
            value={organization}
            onChange={(e) => onFieldChange('organization', e.target.value)}
            placeholder="Ej. Asociación Veterinaria Mexicana"
            className={errors.organization ? "border-red-500" : ""}
          />
          {errors.organization && (
            <p className="text-sm text-red-500">{errors.organization}</p>
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
                    errors.issue_date ? "border-red-500" : ""
                  }`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {issueDate ? (
                    formatDate(issueDate)
                  ) : (
                    <span>Seleccionar Fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={issueDate ? new Date(issueDate) : undefined}
                  onSelect={(date) => onDateSelect('issue_date', date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.issue_date && (
              <p className="text-sm text-red-500">{errors.issue_date}</p>
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
                  {expiryDate ? (
                    formatDate(expiryDate)
                  ) : (
                    <span>Seleccionar Fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={expiryDate ? new Date(expiryDate) : undefined}
                  onSelect={(date) => onDateSelect('expiry_date', date)}
                  disabled={(date) => {
                    if (!issueDate) return true;
                    return date < new Date(issueDate);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearExpiryDate}
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
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          Añadir
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default CertificationForm;
