
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { VeterinarianProfile, ServiceOffered } from '@/features/auth/types/veterinarianTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseServiceFormProps {
  control: Control<VeterinarianProfile>;
}

export const useServiceForm = ({ control }: UseServiceFormProps) => {
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

  const serviceFields = fields as ServiceOffered[];

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewService({ name: '', description: '' });
    setNewServiceErrors({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setNewService(prev => ({ ...prev, [field]: value }));
  };

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
      
      closeDialog();
    }
  };

  return {
    serviceFields,
    isDialogOpen,
    newService,
    newServiceErrors,
    openDialog,
    closeDialog,
    handleFieldChange,
    handleAddService,
    removeService: remove
  };
};
