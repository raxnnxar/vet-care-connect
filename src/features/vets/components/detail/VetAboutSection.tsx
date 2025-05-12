
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/molecules/card';

interface VetAboutSectionProps {
  bio?: string;
}

const VetAboutSection: React.FC<VetAboutSectionProps> = ({ bio }) => {
  if (!bio) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <User className="mr-2 h-5 w-5 text-[#4DA6A8]" />
          Acerca de
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700">{bio}</p>
      </CardContent>
    </Card>
  );
};

export default VetAboutSection;
