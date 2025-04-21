
import React from 'react';
import { Input } from '@/ui/atoms/input';

export interface ProfileAddressFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  helpText?: string;
}

const ProfileAddressField = ({
  value,
  onChange,
  label,
  placeholder,
  helpText
}: ProfileAddressFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full"
      />
      {helpText && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default ProfileAddressField;
