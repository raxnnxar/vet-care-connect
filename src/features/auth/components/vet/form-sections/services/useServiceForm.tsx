
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Control } from 'react-hook-form';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseServiceFormProps {
  control: Control<VeterinarianProfile>;
}

export const useServiceForm = ({ control }: UseServiceFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: ''
  });
  const [newServiceErrors, setNewServiceErrors] = useState<Record<string, string>>({});
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services_offered',
  });
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewService({ name: '', description: '' });
    setNewServiceErrors({});
  };
  
  const handleFieldChange = (field: string, value: string) => {
    setNewService(prev => ({ ...prev, [field]: value }));
    // Clear errors when field is edited
    if (newServiceErrors[field]) {
      const updatedErrors = { ...newServiceErrors };
      delete updatedErrors[field];
      setNewServiceErrors(updatedErrors);
    }
  };
  
  const validateService = () => {
    const errors: Record<string, string> = {};
    
    // We're making fields optional now so returning true
    return true;
  };
  
  const handleAddService = () => {
    if (validateService()) {
      append({
        id: uuidv4(),
        name: newService.name,
        description: newService.description
      });
      closeDialog();
    }
  };

  return {
    serviceFields: fields,
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
