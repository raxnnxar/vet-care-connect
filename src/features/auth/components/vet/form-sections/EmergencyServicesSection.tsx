
import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '../../../types/veterinarianTypes';
import { Label } from '@/ui/atoms/label';
import { Switch } from '@/ui/atoms/switch';

interface EmergencyServicesSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const EmergencyServicesSection: React.FC<EmergencyServicesSectionProps> = ({
  control,
  errors
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Indica si ofreces servicios de emergencia fuera de tu horario regular de atención
      </p>
      
      <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
        <div>
          <Label htmlFor="emergency_services" className="text-base font-medium text-gray-800">Atención de emergencias</Label>
          <p className="text-sm text-gray-600 mt-1">
            Los dueños de mascotas podrán contactarte fuera de tu horario regular en caso de emergencias
          </p>
        </div>
        <Controller
          name="emergency_services"
          control={control}
          render={({ field }) => (
            <Switch 
              id="emergency_services"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="data-[state=checked]:bg-[#79D0B8]"
            />
          )}
        />
      </div>
    </div>
  );
};

export default EmergencyServicesSection;
