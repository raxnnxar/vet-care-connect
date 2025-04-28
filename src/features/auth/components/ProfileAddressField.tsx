
import React from 'react';
import { Input } from '@/ui/atoms/input';

interface ProfileAddressFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  helpText?: string;
}

const ProfileAddressField: React.FC<ProfileAddressFieldProps> = ({
  value,
  onChange,
  label,
  placeholder,
  helpText,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="address" className="block text-white font-medium">
        {label}
      </label>
      <Input
        id="address"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/90 border-white"
      />
      {helpText && <p className="text-white/80 text-sm">{helpText}</p>}
    </div>
  );
};

export default ProfileAddressField;
