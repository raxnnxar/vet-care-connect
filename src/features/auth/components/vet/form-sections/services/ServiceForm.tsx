
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
          <Label htmlFor="service_name">
            Nombre del Servicio (opcional)
          </Label>
          <Input
            id="service_name"
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Ej. Consulta General, Vacunación, Cirugía, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="service_description">
            Descripción (opcional)
          </Label>
          <Textarea
            id="service_description"
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="Describe brevemente en qué consiste este servicio..."
            rows={4}
          />
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
