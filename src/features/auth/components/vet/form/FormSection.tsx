
import React, { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-12 pt-4 bg-white rounded-xl p-6 shadow-sm">
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
