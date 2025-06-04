
import React, { useState } from 'react';
import { Control, FieldErrors, useController } from 'react-hook-form';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Label } from '@/ui/atoms/label';
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/ui/atoms/switch';
import { GroomingProfile, GroomingService, ServiceWithSizes, ServiceWithoutSizes } from '../../types/groomingTypes';

interface ServicesOfferedSectionProps {
  control: Control<GroomingProfile>;
  errors: FieldErrors<GroomingProfile>;
}

const ServicesOfferedSection: React.FC<ServicesOfferedSectionProps> = ({
  control,
  errors,
}) => {
  const { field } = useController({
    name: 'services_offered',
    control,
    defaultValue: [],
  });

  const [newService, setNewService] = useState({
    nombre: '',
    hasSizes: false,
    precio: '',
    tamaños: [
      { tipo: 'pequeño' as const, precio: '' },
      { tipo: 'mediano' as const, precio: '' },
      { tipo: 'grande' as const, precio: '' },
    ],
  });

  const addService = () => {
    if (!newService.nombre.trim()) return;

    let service: GroomingService;
    
    if (newService.hasSizes) {
      const validSizes = newService.tamaños.filter(size => size.precio && !isNaN(Number(size.precio)));
      if (validSizes.length === 0) return;
      
      service = {
        nombre: newService.nombre,
        tamaños: validSizes.map(size => ({
          tipo: size.tipo,
          precio: Number(size.precio),
        })),
      } as ServiceWithSizes;
    } else {
      if (!newService.precio || isNaN(Number(newService.precio))) return;
      
      service = {
        nombre: newService.nombre,
        precio: Number(newService.precio),
      } as ServiceWithoutSizes;
    }

    field.onChange([...field.value, service]);
    
    // Reset form
    setNewService({
      nombre: '',
      hasSizes: false,
      precio: '',
      tamaños: [
        { tipo: 'pequeño', precio: '' },
        { tipo: 'mediano', precio: '' },
        { tipo: 'grande', precio: '' },
      ],
    });
  };

  const removeService = (index: number) => {
    const updatedServices = field.value.filter((_, i) => i !== index);
    field.onChange(updatedServices);
  };

  const updateSizePrice = (sizeIndex: number, price: string) => {
    const updatedSizes = [...newService.tamaños];
    updatedSizes[sizeIndex].precio = price;
    setNewService({ ...newService, tamaños: updatedSizes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Servicios ofrecidos
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Agrega los servicios que ofreces con sus respectivos precios
        </p>
      </div>

      {/* Lista de servicios agregados */}
      {field.value.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800">Servicios agregados:</h4>
          {field.value.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{service.nombre}</span>
                {'precio' in service ? (
                  <span className="text-sm text-gray-600 ml-2">${service.precio}</span>
                ) : (
                  <div className="text-sm text-gray-600 ml-2">
                    {service.tamaños.map((size, i) => (
                      <span key={i}>
                        {size.tipo}: ${size.precio}
                        {i < service.tamaños.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeService(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para agregar nuevo servicio */}
      <div className="border rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-gray-800">Agregar nuevo servicio</h4>
        
        <div>
          <Label htmlFor="service-name">Nombre del servicio</Label>
          <Input
            id="service-name"
            value={newService.nombre}
            onChange={(e) => setNewService({ ...newService, nombre: e.target.value })}
            placeholder="Ej. Baño básico, Corte de uñas"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={newService.hasSizes}
            onCheckedChange={(checked) => setNewService({ ...newService, hasSizes: checked })}
          />
          <Label>¿Precio varía por tamaño?</Label>
        </div>

        {newService.hasSizes ? (
          <div className="space-y-3">
            <Label>Precios por tamaño</Label>
            {newService.tamaños.map((size, index) => (
              <div key={size.tipo} className="flex items-center space-x-2">
                <span className="w-20 text-sm capitalize">{size.tipo}:</span>
                <span className="text-sm">$</span>
                <Input
                  type="number"
                  value={size.precio}
                  onChange={(e) => updateSizePrice(index, e.target.value)}
                  placeholder="0"
                  className="w-24"
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <Label htmlFor="service-price">Precio</Label>
            <div className="flex items-center space-x-2">
              <span className="text-sm">$</span>
              <Input
                id="service-price"
                type="number"
                value={newService.precio}
                onChange={(e) => setNewService({ ...newService, precio: e.target.value })}
                placeholder="0"
                className="w-32"
              />
            </div>
          </div>
        )}

        <Button
          type="button"
          onClick={addService}
          className="bg-[#79D0B8] hover:bg-[#4DA6A8] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar servicio
        </Button>
      </div>

      {errors.services_offered && (
        <p className="text-sm text-red-600">{errors.services_offered.message}</p>
      )}
    </div>
  );
};

export default ServicesOfferedSection;
