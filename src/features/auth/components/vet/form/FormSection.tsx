
import React, { ReactNode } from 'react';
import SectionHeader from './SectionHeader';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <SectionHeader title={title} />
      {children}
    </div>
  );
};

export default FormSection;
