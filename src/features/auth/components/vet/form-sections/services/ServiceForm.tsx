
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import {
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/molecules/alert-dialog';

interface ServiceFormProps {
  name: string;
  description: string;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  name,
  description,
  errors,
  onChange,
  onCancel,
  onSubmit
}) => {
  return (
    <>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre del Servicio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ej. Consulta General, Vacunación, Cirugía, etc."
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe brevemente en qué consiste este servicio..."
            className={`min-h-[100px] resize-y ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
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
          Añadir Servicio
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};

export default ServiceForm;
