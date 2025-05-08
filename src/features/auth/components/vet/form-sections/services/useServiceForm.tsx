
import { useState, useEffect } from 'react';
import { useFieldArray, Control, FieldValues } from 'react-hook-form';
import { VeterinarianProfile, ServiceOffered } from '@/features/auth/types/veterinarianTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseServiceFormProps {
  control: Control<VeterinarianProfile>;
}

export const useServiceForm = ({ control }: UseServiceFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [newServiceErrors, setNewServiceErrors] = useState<Record<string, string>>({});
  
  // Use useFieldArray with proper typing
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services_offered',
    keyName: 'fieldId', // Custom key name to avoid conflicts with 'id'
  });
  
  // Ensure fields is always treated as an array of ServiceOffered with fieldId
  const serviceFields = Array.isArray(fields) 
    ? fields as unknown as (ServiceOffered & { fieldId: string })[]
    : [];
  
  // Initialize services_offered as an empty array if needed
  useEffect(() => {
    if (!Array.isArray(control._getWatch?.('services_offered'))) {
      // Only set if the function exists and the current value is not an array
      if (control._formValues && typeof control._getWatch === 'function') {
        control._formValues.services_offered = [];
      }
    }
  }, [control]);
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewService({ name: '', description: '', price: '' });
    setNewServiceErrors({});
  };
  
  const handleFieldChange = (field: string, value: string) => {
    setNewService(prev => ({ ...prev, [field]: value }));
    // Clear errors when editing the field
    if (newServiceErrors[field]) {
      const updatedErrors = { ...newServiceErrors };
      delete updatedErrors[field];
      setNewServiceErrors(updatedErrors);
    }
  };
  
  const handleAddService = () => {
    if (!append) return;

    // Validación opcional para el precio (asegurarse de que sea un número válido)
    const priceValue = newService.price ? parseFloat(newService.price) : undefined;
    
    append({
      id: uuidv4(),
      name: newService.name || '',
      description: newService.description || '',
      price: priceValue
    });
    closeDialog();
  };

  return {
    serviceFields,
    isDialogOpen,
    setIsDialogOpen,
    newService,
    newServiceErrors,
    openDialog,
    closeDialog,
    handleFieldChange,
    handleAddService,
    removeService: (index: number) => {
      if (remove) remove(index);
    }
  };
};
