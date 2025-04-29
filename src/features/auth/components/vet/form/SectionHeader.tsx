
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="border-b border-gray-200 pb-2 mb-6">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
  );
};

export default SectionHeader;
