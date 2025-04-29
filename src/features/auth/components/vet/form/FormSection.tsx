
import React, { ReactNode } from 'react';
import { Separator } from '@/ui/atoms/separator';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-12 pt-4 bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      <Separator className="my-4" />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
