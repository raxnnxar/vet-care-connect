
import React from 'react';
import { Button } from '@/ui/atoms/button';
import { ArrowLeft } from 'lucide-react';

interface VetDetailHeaderProps {
  title: string;
  onGoBack: () => void;
}

const VetDetailHeader: React.FC<VetDetailHeaderProps> = ({ title, onGoBack }) => {
  return (
    <div className="flex items-center p-4 bg-[#79D0B8]">
      <Button 
        variant="ghost" 
        className="text-white p-1 mr-2" 
        onClick={onGoBack}
      >
        <ArrowLeft size={24} />
      </Button>
      <h1 className="text-xl font-medium text-white">{title}</h1>
    </div>
  );
};

export default VetDetailHeader;
