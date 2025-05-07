
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile, ServiceOffered } from '../../../types/veterinarianTypes';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/molecules/alert-dialog';
import ServicesList from './services/ServicesList';
import EmptyServicesState from './services/EmptyServicesState';
import ServiceForm from './services/ServiceForm';
import { useServiceForm } from './services/useServiceForm';

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
  const {
    serviceFields,
    isDialogOpen,
    newService,
    newServiceErrors,
    openDialog,
    closeDialog,
    handleFieldChange,
    handleAddService,
    removeService,
    setIsDialogOpen
  } = useServiceForm({ control });

  // Convert serviceFields to ServiceOffered[] to match the expected type for ServicesList
  const servicesData: ServiceOffered[] = serviceFields.map(field => ({
    id: field.id || '',
    name: field.name || '',
    description: field.description || ''
  }));

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Detalla los servicios veterinarios que ofreces para que los dueños de mascotas sepan qué esperar
      </p>
      
      {/* Check if serviceFields exists and is an array */}
      {Array.isArray(servicesData) && servicesData.length === 0 ? (
        <EmptyServicesState onAddClick={openDialog} />
      ) : (
        <ServicesList 
          services={servicesData} 
          onAddClick={openDialog} 
          onRemoveService={removeService} 
        />
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
          
          <ServiceForm
            name={newService.name}
            description={newService.description}
            errors={newServiceErrors}
            onChange={handleFieldChange}
            onCancel={closeDialog}
            onSubmit={handleAddService}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicesSection;
