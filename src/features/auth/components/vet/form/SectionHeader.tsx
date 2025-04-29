
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

// This component is kept for backward compatibility but no longer used
// Use FormSection directly which now has the header built-in
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="border-b border-gray-200 pb-3 mb-6">
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
    </div>
  );
};

export default SectionHeader;
