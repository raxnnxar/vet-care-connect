
import React, { ReactNode } from 'react';
import SectionHeader from './SectionHeader';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-12 pt-4 bg-white rounded-xl p-6 shadow-sm">
      <SectionHeader title={title} />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
