
import React from 'react';
import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import GroomingDesktopAvailabilityView from './availability/GroomingDesktopAvailabilityView';
import GroomingMobileAvailabilityView from './availability/GroomingMobileAvailabilityView';
import { GroomingProfile } from '../../types/groomingTypes';

interface GroomingAvailabilitySectionProps {
  control: Control<GroomingProfile>;
  errors: FieldErrors<GroomingProfile>;
  setValue: UseFormSetValue<GroomingProfile>;
}

const GroomingAvailabilitySection: React.FC<GroomingAvailabilitySectionProps> = ({
  control,
  errors,
  setValue,
}) => {
  return (
    <div className="space-y-4">
      <GroomingDesktopAvailabilityView control={control} errors={errors} setValue={setValue} />
      <GroomingMobileAvailabilityView control={control} setValue={setValue} />
    </div>
  );
};

export default GroomingAvailabilitySection;
