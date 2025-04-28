
import React from 'react';
import { Input } from '@/ui/atoms/input';

interface PhoneNumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  helpText?: string;
}

const PhoneNumberField: React.FC<PhoneNumberFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helpText,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Filter non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, '');
    
    onChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="phoneNumber" className="block text-white font-medium">
        {label}
      </label>
      <Input
        id="phoneNumber"
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="bg-white/90 border-white"
      />
      {helpText && <p className="text-white/80 text-sm">{helpText}</p>}
    </div>
  );
};

export default PhoneNumberField;
