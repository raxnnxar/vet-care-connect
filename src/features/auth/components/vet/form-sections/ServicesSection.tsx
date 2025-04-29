
import React, { useState } from 'react';
import { Control, Controller, FieldErrors, useFieldArray } from 'react-hook-form';
import { VeterinarianProfile, ServiceOffered } from '../../../types/veterinarianTypes';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { Button } from '@/ui/atoms/button';
import { PlusCircle, Trash2, Stethoscope } from 'lucide-react';
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

interface ServicesSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
  setValue: any;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  control,
  errors,
  setValue
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState<Omit<ServiceOffered, 'id'>>({
    name: '',
    description: ''
  });
  const [newServiceErrors, setNewServiceErrors] = useState<Record<string, string>>({});

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services_offered'
  });

  const validateNewService = () => {
    const errors: Record<string, string> = {};

    if (!newService.name.trim()) {
      errors.name = 'El nombre del servicio es requerido';
    }

    if (!newService.description.trim()) {
      errors.description = 'La descripción del servicio es requerida';
    }

    setNewServiceErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddService = () => {
    if (validateNewService()) {
      append({
        id: uuidv4(),
        ...newService
      });
      
      setNewService({
        name: '',
        description: ''
      });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Detalla los servicios veterinarios que ofreces para que los dueños de mascotas sepan qué esperar
      </p>
      
      {fields.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50 flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-6">
            No has añadido ningún servicio. 
            Detalla los servicios que ofreces para que los dueños de mascotas sepan qué esperar.
          </p>
          <Button 
            type="button" 
            onClick={() => setIsDialogOpen(true)} 
            variant="outline"
            className="mx-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Servicio
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="bg-gray-50 pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Stethoscope className="h-4 w-4 mr-2 text-gray-500" />
                      {field.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 text-sm">{field.description}</p>
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
              Añadir Servicio
            </Button>
          </div>
        </>
      )}

      {/* Add Service Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Añadir Servicio</AlertDialogTitle>
            <AlertDialogDescription>
              Detalla los servicios veterinarios que ofreces.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nombre del Servicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej. Consulta General, Vacunación, Cirugía, etc."
                className={newServiceErrors.name ? "border-red-500" : ""}
              />
              {newServiceErrors.name && (
                <p className="text-sm text-red-500">{newServiceErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Descripción <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={newService.description}
                onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe brevemente en qué consiste este servicio..."
                className={`min-h-[100px] resize-y ${newServiceErrors.description ? "border-red-500" : ""}`}
              />
              {newServiceErrors.description && (
                <p className="text-sm text-red-500">{newServiceErrors.description}</p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleAddService();
              }}
            >
              Añadir Servicio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicesSection;
