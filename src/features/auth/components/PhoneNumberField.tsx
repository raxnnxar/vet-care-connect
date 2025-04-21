
import React from 'react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/molecules/form';
import { Input } from '@/ui/atoms/input';
import { Control } from 'react-hook-form';

export interface PhoneNumberFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  helpText?: string;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({ 
  control, 
  name, 
  label, 
  placeholder = '', 
  helpText = '' 
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          {helpText && <FormDescription>{helpText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneNumberField;
