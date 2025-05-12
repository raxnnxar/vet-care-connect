
import React from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import { AvailabilitySectionProps } from './availability/types';
import MobileAvailabilityView from './availability/MobileAvailabilityView';
import DesktopAvailabilityView from './availability/DesktopAvailabilityView';

const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  control,
  errors,
}) => {
  // Get the form methods from the parent form context
  const formMethods = useFormContext();

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">
        Establece tu horario de disponibilidad para que los dueños de mascotas puedan programar citas contigo
      </p>
      
      <div className="overflow-hidden bg-white rounded-lg border">
        <FormProvider {...formMethods}>
          {/* Vista móvil: Diseño en acordeón */}
          <MobileAvailabilityView control={control} errors={errors} />
          
          {/* Vista escritorio: Diseño en tabla */}
          <DesktopAvailabilityView control={control} errors={errors} />
        </FormProvider>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <p className="text-yellow-800 text-sm">
          <strong>Importante:</strong> Estos horarios serán visibles para los dueños de mascotas y se utilizarán para programar citas. Asegúrate de que reflejen tu disponibilidad real.
        </p>
      </div>
    </div>
  );
};

export default AvailabilitySection;
