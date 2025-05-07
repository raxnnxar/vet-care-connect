
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { VeterinarianProfile } from '../../../types/veterinarianTypes';
import LanguagesSelector from './languages/LanguagesSelector';

interface LanguagesSectionProps {
  control: Control<VeterinarianProfile>;
  errors: FieldErrors<VeterinarianProfile>;
}

const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  control,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <LanguagesSelector control={control} />
    </div>
  );
};

export default LanguagesSection;
