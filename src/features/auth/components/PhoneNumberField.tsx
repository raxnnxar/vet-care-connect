
import React from 'react';
import { Input } from '@/ui/atoms/input';

export interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  helpText?: string;
}

const PhoneNumberField = ({
  value,
  onChange,
  label,
  placeholder,
  helpText
}: PhoneNumberFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and basic phone formatting characters
    const formattedValue = e.target.value.replace(/[^\d+\-() ]/g, '');
    onChange(formattedValue);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
      />
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default PhoneNumberField;
