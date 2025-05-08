
import React from 'react';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import {
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/molecules/alert-dialog';
import { DollarSign } from 'lucide-react';

interface ServiceFormProps {
  name: string;
  description: string;
  price?: string | number;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  name,
  description,
  price,
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
          <Label htmlFor="service_price">
            Precio (MXN)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="service_price"
              type="number"
              value={price ?? ''}
              onChange={(e) => onChange('price', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="pl-10"
            />
          </div>
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
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
