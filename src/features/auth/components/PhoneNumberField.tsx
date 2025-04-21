
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/ui/molecules/form';
import { Input } from '@/ui/atoms/input';
import { UseFormReturn } from 'react-hook-form';

export interface PhoneNumberFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
  helpText?: string;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  helpText
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type="tel" placeholder={placeholder} className="h-10" />
          </FormControl>
          {helpText && <FormDescription>{helpText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhoneNumberField;
