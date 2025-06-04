
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import DesktopAvailabilityView from '../vet/form-sections/availability/DesktopAvailabilityView';
import MobileAvailabilityView from '../vet/form-sections/availability/MobileAvailabilityView';
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
      <DesktopAvailabilityView control={control as any} />
      <MobileAvailabilityView control={control as any} />
    </div>
  );
};

export default GroomingAvailabilitySection;
