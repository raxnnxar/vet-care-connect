
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Label } from '@/ui/atoms/label';
import { Input } from '@/ui/atoms/input';
import { Textarea } from '@/ui/atoms/textarea';
import { AlertCircle } from 'lucide-react';
import { VeterinarianProfile } from '@/features/auth/types/veterinarianTypes';

interface BasicInfoFieldsProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  control,
  errors,
}) => {
  return (
    <>
      {/* License Number */}
      <div className="space-y-2">
        <Label htmlFor="license_number" className="text-base">
          Número de licencia
        </Label>
        <Input
          id="license_number"
          {...control.register('license_number')}
          className={errors.license_number ? 'border-red-500' : ''}
        />
        {errors.license_number && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.license_number.message}
          </p>
        )}
      </div>
        
      {/* Years of Experience */}
      <div className="space-y-2">
        <Label htmlFor="years_of_experience" className="text-base">
          Años de experiencia
        </Label>
        <Input
          id="years_of_experience"
          type="number"
          min="0"
          max="70"
          {...control.register('years_of_experience', {
            valueAsNumber: true,
          })}
          className={errors.years_of_experience ? 'border-red-500' : ''}
        />
        {errors.years_of_experience && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.years_of_experience.message}
          </p>
        )}
      </div>
        
      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">Biografía profesional</Label>
        <Textarea
          id="bio"
          {...control.register('bio')}
          rows={4}
          placeholder="Describe tu experiencia profesional, enfoque de práctica, o cualquier información adicional relevante"
        />
      </div>
    </>
  );
};

export default BasicInfoFields;
