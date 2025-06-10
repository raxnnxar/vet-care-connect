
import React from 'react';

interface GroomingAboutSectionProps {
  location?: string;
}

// This component is now deprecated as we've moved location display 
// to the GroomingLocationSection with map functionality
const GroomingAboutSection: React.FC<GroomingAboutSectionProps> = ({
  location
}) => {
  // Return null to effectively remove this section
  return null;
};

export default GroomingAboutSection;
