
import { useState, useEffect } from 'react';
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
  
  // Asegurarse de que tenemos un control válido
  const safeControl = control || {};
  
  // Usar useFieldArray con una verificación de seguridad
  const { fields, append, remove } = useFieldArray({
    control: safeControl,
    name: 'services_offered',
    keyName: 'fieldId', // Usar un nombre personalizado para la clave para evitar conflictos con 'id'
  });
  
  // Asegurar que los campos siempre sean un array
  const serviceFields = Array.isArray(fields) ? fields : [];
  
  // Inicializar services_offered como un array vacío si es necesario
  useEffect(() => {
    if (control && !Array.isArray(control._getWatch('services_offered'))) {
      control._formValues.services_offered = [];
    }
  }, [control]);
  
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewService({ name: '', description: '' });
    setNewServiceErrors({});
  };
  
  const handleFieldChange = (field: string, value: string) => {
    setNewService(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando se edita el campo
    if (newServiceErrors[field]) {
      const updatedErrors = { ...newServiceErrors };
      delete updatedErrors[field];
      setNewServiceErrors(updatedErrors);
    }
  };
  
  const handleAddService = () => {
    if (!append) return;
    
    append({
      id: uuidv4(),
      name: newService.name || '',
      description: newService.description || ''
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
