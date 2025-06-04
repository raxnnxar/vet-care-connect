
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import GroomingDesktopAvailabilityView from './availability/GroomingDesktopAvailabilityView';
import GroomingMobileAvailabilityView from './availability/GroomingMobileAvailabilityView';
import { GroomingProfile } from '../../types/groomingTypes';

interface GroomingAvailabilitySectionProps {
  control: Control<GroomingProfile>;
  errors: FieldErrors<GroomingProfile>;
}

const GroomingAvailabilitySection: React.FC<GroomingAvailabilitySectionProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-4">
      <GroomingDesktopAvailabilityView control={control} errors={errors} />
      <GroomingMobileAvailabilityView control={control} />
    </div>
  );
};

export default GroomingAvailabilitySection;
