
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '../../../types/veterinarianTypes';
import { PlusCircle } from 'lucide-react';
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
    removeService
  } = useServiceForm({ control });

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Detalla los servicios veterinarios que ofreces para que los dueños de mascotas sepan qué esperar
      </p>
      
      {serviceFields.length === 0 ? (
        <EmptyServicesState onAddClick={openDialog} />
      ) : (
        <ServicesList 
          services={serviceFields} 
          onAddClick={openDialog} 
          onRemoveService={removeService} 
        />
      )}

      {/* Add Service Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={closeDialog}>
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
