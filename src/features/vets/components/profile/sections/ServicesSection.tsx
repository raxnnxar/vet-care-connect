
import React from 'react';
import { Stethoscope } from 'lucide-react';
import { ServiceOffered } from '@/features/auth/types/veterinarianTypes';
import { EditableSection } from '../EditableSection';
import { Card, CardContent } from '@/ui/molecules/card';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Button } from '@/ui/atoms/button';

interface ServicesSectionProps {
  services: ServiceOffered[];
  isEditing: boolean;
  toggleEditing: () => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
  editedServices: ServiceOffered[];
  setEditedServices: React.Dispatch<React.SetStateAction<ServiceOffered[]>>;
  newService: ServiceOffered;
  setNewService: React.Dispatch<React.SetStateAction<ServiceOffered>>;
  addService: () => void;
  removeService: (id: string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  isEditing,
  toggleEditing,
  handleSave,
  isLoading,
  editedServices,
  setEditedServices,
  newService,
  setNewService,
  addService,
  removeService
}) => {
  return (
    <EditableSection
      title="Servicios Ofrecidos"
      isEditing={isEditing}
      onEdit={toggleEditing}
      onSave={handleSave}
      isSaving={isLoading}
    >
      {!isEditing ? (
        <div>
          {services && services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="bg-[#e8f7f3] p-3 rounded-full mr-4">
                      <Stethoscope className="w-6 h-6 text-[#4DA6A8]" />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg">{service.name}</h3>
                      {service.description && (
                        <p className="text-gray-600">{service.description}</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {service.price !== undefined && (
                        <div className="font-medium text-green-700 text-xl">
                          ${service.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-6">
              No hay servicios registrados
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {editedServices.map((service, index) => (
            <Card key={service.id || index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Input 
                      value={service.name}
                      onChange={(e) => {
                        const updatedServices = [...editedServices];
                        updatedServices[index].name = e.target.value;
                        setEditedServices(updatedServices);
                      }}
                      placeholder="Nombre del servicio"
                      className="flex-1 mr-2"
                    />
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-1">$</span>
                      <Input 
                        type="number"
                        value={service.price || ''}
                        onChange={(e) => {
                          const updatedServices = [...editedServices];
                          updatedServices[index].price = e.target.value ? parseFloat(e.target.value) : undefined;
                          setEditedServices(updatedServices);
                        }}
                        placeholder="Precio"
                        className="w-24"
                      />
                    </div>
                  </div>
                  
                  <Textarea
                    value={service.description || ''}
                    onChange={(e) => {
                      const updatedServices = [...editedServices];
                      updatedServices[index].description = e.target.value;
                      setEditedServices(updatedServices);
                    }}
                    placeholder="Descripción del servicio (opcional)"
                    className="h-20"
                  />
                  
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => removeService(service.id)}
                  >
                    Eliminar servicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Add new service form */}
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Agregar nuevo servicio</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Input 
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    placeholder="Nombre del servicio"
                    className="flex-1 mr-2"
                  />
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-1">$</span>
                    <Input 
                      type="number"
                      value={newService.price || ''}
                      onChange={(e) => setNewService({
                        ...newService, 
                        price: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      placeholder="Precio"
                      className="w-24"
                    />
                  </div>
                </div>
                
                <Textarea
                  value={newService.description || ''}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                  placeholder="Descripción del servicio (opcional)"
                  className="h-20"
                />
                
                <Button 
                  variant="outline" 
                  onClick={addService}
                  disabled={!newService.name}
                  className="w-full"
                >
                  + Agregar Servicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </EditableSection>
  );
};

export default ServicesSection;
