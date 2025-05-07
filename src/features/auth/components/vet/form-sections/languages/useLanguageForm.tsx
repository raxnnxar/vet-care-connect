
import { useState } from 'react';
import { useController, Control } from 'react-hook-form';
import { VeterinarianProfile, LANGUAGES } from '@/features/auth/types/veterinarianTypes';

interface UseLanguageFormProps {
  control: Control<VeterinarianProfile>;
}

export const useLanguageForm = ({ control }: UseLanguageFormProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Use useController with proper default values and type safety
  const { field } = useController({
    name: 'languages_spoken',
    control,
    defaultValue: [], // Ensure we always have a default empty array
  });

  // Ensure languagesValue is always a valid array
  const languagesValue: string[] = Array.isArray(field.value) 
    ? field.value 
    : [];

  const handleSelectLanguage = (value: string) => {
    // Only continue if the value is a non-empty string
    if (!value?.trim()) return;
    
    // Check if already selected
    const isSelected = languagesValue.includes(value);
    
    let newValues: string[];
    if (isSelected) {
      // Remove if already selected
      newValues = languagesValue.filter((val: string) => val !== value);
    } else {
      // Add if not already selected
      newValues = [...languagesValue, value];
    }
    
    // Update the field value
    field.onChange(newValues);
    
    // Clear search value after selection
    setSearchValue('');
  };

  const handleRemoveLanguage = (value: string) => {
    if (!value?.trim()) return;
    
    const newValues = languagesValue.filter((val: string) => val !== value);
    field.onChange(newValues);
  };

  // Return methods and state
  return {
    isOpen,
    setIsOpen,
    searchValue, 
    setSearchValue,
    languagesValue,
    handleSelectLanguage,
    handleRemoveLanguage,
    allLanguages: LANGUAGES
  };
};
