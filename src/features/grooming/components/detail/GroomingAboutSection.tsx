
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';

interface GroomingAboutSectionProps {
  location?: string;
}

const GroomingAboutSection: React.FC<GroomingAboutSectionProps> = ({ location }) => {
  if (!location) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700">{location}</p>
      </CardContent>
    </Card>
  );
};

export default GroomingAboutSection;
