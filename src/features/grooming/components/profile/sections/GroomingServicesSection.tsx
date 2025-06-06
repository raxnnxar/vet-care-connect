
import React, { useState } from 'react';
import { Button } from '@/ui/atoms/button';
import { Input } from '@/ui/atoms/input';
import { Card } from '@/ui/molecules/card';
import { Badge } from '@/ui/atoms/badge';
import { Plus, Trash2, Scissors } from 'lucide-react';
import { EditableSection } from '@/features/vets/components/profile/EditableSection';
import { GroomingService } from '@/features/auth/types/groomingTypes';

interface GroomingServicesSectionProps {
  services: GroomingService[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedServices: GroomingService[];
  addService: (service: GroomingService) => void;
  removeService: (index: number) => void;
}

const GroomingServicesSection: React.FC<GroomingServicesSectionProps> = ({
  services,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedServices,
  addService,
  removeService
}) => {
  const [newService, setNewService] = useState<GroomingService>({
    nombre: '',
    precio: 0
  });

  const handleAddService = () => {
    if (!newService.nombre.trim()) return;
    
    addService(newService);
    setNewService({ nombre: '', precio: 0 });
  };

  const hasServiceSizes = (service: GroomingService): service is { nombre: string; tamaños: Array<{ tipo: 'pequeño' | 'mediano' | 'grande'; precio: number }> } => {
    return 'tamaños' in service;
  };

  return (
    <EditableSection
      title="Servicios Ofrecidos"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {isEditing ? (
        <div className="space-y-4">
          {/* Service list */}
          <div className="space-y-3">
            {editedServices.map((service, index) => (
              <Card key={index} className="p-3 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{service.nombre}</h4>
                    <div className="mt-1">
                      {hasServiceSizes(service) ? (
                        <div className="space-y-1">
                          {service.tamaños.map((size, sizeIndex) => (
                            <div key={sizeIndex} className="flex justify-between items-center text-sm">
                              <span className="capitalize">{size.tipo}:</span>
                              <span className="font-medium">${size.precio}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-[#79D0B8]">${service.precio}</span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Add new service */}
          <Card className="p-4 border-2 border-dashed border-gray-300">
            <div className="space-y-3">
              <Input
                value={newService.nombre}
                onChange={(e) => setNewService({ ...newService, nombre: e.target.value })}
                placeholder="Nombre del servicio (ej. Baño y secado)"
              />
              <Input
                type="number"
                value={newService.precio || ''}
                onChange={(e) => setNewService({ ...newService, precio: Number(e.target.value) })}
                placeholder="Precio"
              />
              <Button
                onClick={handleAddService}
                disabled={!newService.nombre.trim()}
                className="w-full bg-[#79D0B8] hover:bg-[#5FBFB3]"
              >
                <Plus size={16} className="mr-2" />
                Agregar Servicio
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {services.length > 0 ? (
            <div className="grid gap-3">
              {services.map((service, index) => (
                <Card key={index} className="p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#79D0B8]/10 p-2 rounded-full">
                      <Scissors size={16} className="text-[#79D0B8]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{service.nombre}</h4>
                      <div className="mt-1">
                        {hasServiceSizes(service) ? (
                          <div className="flex flex-wrap gap-2">
                            {service.tamaños.map((size, sizeIndex) => (
                              <Badge key={sizeIndex} variant="outline" className="text-xs">
                                {size.tipo}: ${size.precio}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-lg font-semibold text-[#79D0B8]">${service.precio}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No hay servicios registrados</p>
          )}
        </div>
      )}
    </EditableSection>
  );
};

export default GroomingServicesSection;
